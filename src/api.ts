export interface AssetItem {
    id: string;
    title: string;
    description: string;
    imageUrl?: string;
    sourceUrl: string;
    type: string;
    author?: string;
    date?: string;
    mediaUrl?: string;
}

// Google Books API Helper
async function fetchGoogleBooks(query: string, page: number, sort: string): Promise<AssetItem[]> {
    try {
        const startIndex = (page - 1) * 12;
        let sortParam = '';
        if (sort === 'newest') sortParam = '&orderBy=newest';

        const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&filter=free-ebooks&startIndex=${startIndex}&maxResults=12${sortParam}`);
        const data = await res.json();

        if (!data.items) return [];

        return data.items.map((item: any) => ({
            id: `google_${item.id}`,
            title: item.volumeInfo.title,
            description: item.volumeInfo.description?.substring(0, 150) + '...' || 'Free eBook from Google Books',
            imageUrl: item.volumeInfo.imageLinks?.thumbnail?.replace('http:', 'https:'),
            sourceUrl: item.volumeInfo.infoLink,
            type: 'ebooks',
            author: item.volumeInfo.authors?.[0] || 'Unknown Author',
            date: item.volumeInfo.publishedDate?.substring(0, 4),
            mediaUrl: item.accessInfo?.webReaderLink
        }));
    } catch (e) {
        console.error("Failed to fetch Google Books", e);
        return [];
    }
}

// Gutendex (Project Gutenberg) API Helper
async function fetchGutenberg(query: string, page: number): Promise<AssetItem[]> {
    try {
        const res = await fetch(`https://gutendex.com/books/?search=${encodeURIComponent(query)}&page=${page}`);
        const data = await res.json();

        if (!data.results) return [];

        return data.results.slice(0, 12).map((item: any) => {
            const formats = item.formats;
            let mediaUrl = undefined;
            if (formats['text/html']) mediaUrl = formats['text/html'];
            else if (formats['application/epub+zip']) mediaUrl = formats['application/epub+zip'];
            else mediaUrl = formats['text/plain; charset=us-ascii'];

            return {
                id: `gutenberg_${item.id}`,
                title: item.title,
                description: item.subjects?.join(', ')?.substring(0, 150) + '...' || 'Project Gutenberg E-Book',
                imageUrl: formats['image/jpeg'],
                sourceUrl: `https://www.gutenberg.org/ebooks/${item.id}`,
                type: 'ebooks',
                author: item.authors?.[0]?.name || 'Unknown Author',
                mediaUrl: mediaUrl
            };
        });
    } catch (e) {
        console.error("Failed to fetch Gutenberg", e);
        return [];
    }
}

// Unified Books & Ebooks Engine (Open Library + Google Books + Gutenberg)
export async function fetchBooks(query: string = 'space exploration', page: number = 1, requireFulltext: boolean = false, sort: string = 'default'): Promise<AssetItem[]> {
    try {
        const fulltextFilter = requireFulltext ? '&has_fulltext=true' : '';
        let olSortQuery = '';
        if (sort === 'newest') olSortQuery = '&sort=new';
        if (sort === 'oldest') olSortQuery = '&sort=old';

        const openLibraryPromise = fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=12&page=${page}${fulltextFilter}${olSortQuery}`)
            .then(res => res.json())
            .then(data => data.docs ? data.docs.map((doc: any) => ({
                id: `ol_${doc.key}`,
                title: doc.title,
                description: doc.first_publish_year ? `First published in ${doc.first_publish_year} (Open Library)` : 'Book from Open Library',
                imageUrl: doc.cover_i ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg` : undefined,
                sourceUrl: `https://openlibrary.org${doc.key}`,
                type: requireFulltext ? 'ebooks' : 'books',
                author: doc.author_name?.[0] || 'Unknown Author',
            })) : [])
            .catch(e => { console.error("OL Error", e); return []; });

        const [olResults, gbResults, pgResults] = await Promise.all([
            openLibraryPromise,
            fetchGoogleBooks(query, page, sort),
            fetchGutenberg(query, page)
        ]);

        // Interleave the arrays to create a highly diverse grid payload
        const combined: AssetItem[] = [];
        const maxLength = Math.max(olResults.length, gbResults.length, pgResults.length);
        for (let i = 0; i < maxLength; i++) {
            if (gbResults[i]) combined.push(gbResults[i]);
            if (pgResults[i]) combined.push(pgResults[i]);
            if (olResults[i]) combined.push(olResults[i]);
        }

        return combined;
    } catch (e) {
        console.error("Failed to fetch unified books", e);
        return [];
    }
}

// Open Library API (Manuscripts)
export async function fetchManuscripts(query: string = 'history', page: number = 1, sort: string = 'default'): Promise<AssetItem[]> {
    try {
        let sortQuery = '';
        if (sort === 'newest') sortQuery = '&sort=new';
        if (sort === 'oldest') sortQuery = '&sort=old';
        const res = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&subject=manuscripts&limit=12&page=${page}${sortQuery}`);
        const data = await res.json();
        return data.docs.map((doc: any) => ({
            id: doc.key + '_ms',
            title: doc.title,
            description: doc.first_publish_year ? `Historical Manuscript (c. ${doc.first_publish_year})` : 'Historical Manuscript',
            imageUrl: doc.cover_i ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg` : undefined,
            sourceUrl: `https://openlibrary.org${doc.key}`,
            type: 'manuscripts',
            author: doc.author_name?.[0] || 'Unknown Author',
        }));
    } catch (e) {
        console.error("Failed to fetch manuscripts", e);
        return [];
    }
}

// NASA Image and Video Library
export async function fetchSpaceData(query: string = 'nebula', mediaType: 'image' | 'video' = 'image', page: number = 1, sort: string = 'default'): Promise<AssetItem[]> {
    try {
        // NASA doesn't have a strict sort by date other than their default relevance.
        // We'll pass the variable to avoid the unused param warning, but we might have to sort manually if NASA doesn't support it natively for all queries.
        // We can just log it for now to suppress the warning.
        console.log("NASA sort requested: ", sort);
        const res = await fetch(`https://images-api.nasa.gov/search?q=${encodeURIComponent(query)}&media_type=${mediaType}&page=${page}`);
        const data = await res.json();
        // NASA API sometimes returns less items, we take 12 for grid consistency
        const items = data.collection.items.slice(0, 12);

        return items.map((item: any) => ({
            id: item.data[0].nasa_id,
            title: item.data[0].title,
            description: item.data[0].description?.substring(0, 150) + '...' || 'NASA Archive',
            imageUrl: item.links?.[0]?.href,
            sourceUrl: `https://images.nasa.gov/details-${item.data[0].nasa_id}`,
            type: mediaType === 'video' ? 'video' : 'space',
            date: item.data[0].date_created?.split('T')[0],
        }));
    } catch (e) {
        console.error("Failed to fetch NASA data", e);
        return [];
    }
}

// arXiv API (Research Papers) - Using a public CORS proxy for demo, or direct if CORS allows
export async function fetchPapers(query: string = 'astrophysics', page: number = 1, sort: string = 'default'): Promise<AssetItem[]> {
    try {
        // sortBy: "relevance" or "submittedDate"
        const sortBy = sort === 'newest' ? 'submittedDate' : 'relevance';
        const start = (page - 1) * 12;
        const res = await fetch(`https://export.arxiv.org/api/query?search_query=all:${encodeURIComponent(query)}&start=${start}&max_results=12&sortBy=${sortBy}&sortOrder=descending`);
        const text = await res.text();

        // Very basic hacky XML parsing for the sake of a dependency-free demo
        // In production, use fast-xml-parser or DOMParser
        const parser = new DOMParser();
        const xml = parser.parseFromString(text, "text/xml");
        const entries = Array.from(xml.querySelectorAll("entry"));

        return entries.map((entry: any) => {
            const id = entry.querySelector("id")?.textContent || '';
            return {
                id: id,
                title: entry.querySelector("title")?.textContent || 'Untitled Paper',
                description: entry.querySelector("summary")?.textContent?.substring(0, 150) + '...' || 'Research Paper',
                sourceUrl: id,
                type: 'papers',
                author: entry.querySelector("author name")?.textContent || 'arXiv Author',
                date: entry.querySelector("published")?.textContent?.split('T')[0],
            }
        });
    } catch (e) {
        console.error("Failed to fetch papers", e);
        return [];
    }
}

// Art Institute of Chicago (Art & Prints)
export async function fetchArt(query: string = 'stars', page: number = 1, isPrint: boolean = false, sort: string = 'default'): Promise<AssetItem[]> {
    try {
        // Filter by artwork_type_title for prints if requested
        const q = isPrint ? `${query} print` : query;
        let sortQuery = ''; // The Art Institute has more complex sorting, default is relevance.
        if (sort !== 'default') {
            console.log("Art sort requested: ", sort);
        }
        const res = await fetch(`https://api.artic.edu/api/v1/artworks/search?q=${encodeURIComponent(q)}&limit=12&page=${page}&fields=id,title,image_id,artist_title,term_titles,artwork_type_title${sortQuery}`);
        const data = await res.json();
        return data.data
            .filter((item: any) => item.image_id) // Only art with images
            .map((item: any) => ({
                id: item.id.toString() + (isPrint ? '_print' : ''),
                title: item.title,
                description: item.artwork_type_title || item.term_titles?.join(', ') || 'Classical Artwork',
                imageUrl: `https://www.artic.edu/iiif/2/${item.image_id}/full/843,/0/default.jpg`,
                sourceUrl: `https://www.artic.edu/artworks/${item.id}`,
                type: isPrint ? 'prints' : 'art',
                author: item.artist_title || 'Unknown Artist',
            }));
    } catch (e) {
        console.error("Failed to fetch art", e);
        return [];
    }
}

// --- NEW DATA SOURCES ---

// Internet Archive API Helper
async function fetchInternetArchive(query: string, filter: string, page: number, typeLabel: string, sort: string = 'default'): Promise<AssetItem[]> {
    try {
        const rows = 12;
        let sortParam = 'downloads+desc';
        if (sort === 'newest') sortParam = 'date+desc';
        if (sort === 'oldest') sortParam = 'date+asc';

        const url = `https://archive.org/advancedsearch.php?q=${encodeURIComponent(query)}+AND+${encodeURIComponent(filter)}&fl[]=identifier,title,description,creator,date,mediatype&sort[]=${sortParam}&rows=${rows}&page=${page}&output=json`;

        const res = await fetch(url);
        const data = await res.json();

        return data.response.docs.map((doc: any) => ({
            id: doc.identifier,
            title: doc.title,
            description: Array.isArray(doc.description) ? doc.description[0].replace(/<[^>]*>?/gm, '').substring(0, 150) + '...' : (doc.description?.replace(/<[^>]*>?/gm, '').substring(0, 150) + '...' || `Internet Archive ${typeLabel}`),
            imageUrl: `https://archive.org/services/img/${doc.identifier}`,
            sourceUrl: `https://archive.org/details/${doc.identifier}`,
            type: typeLabel.toLowerCase(),
            author: Array.isArray(doc.creator) ? doc.creator[0] : (doc.creator || 'Internet Archive'),
            date: doc.date?.substring(0, 4), // Year only usually
            mediaUrl: typeLabel === 'AudioBooks' ? `https://archive.org/embed/${doc.identifier}?playlist=1` : undefined
        }));
    } catch (e) {
        console.error(`Failed to fetch IA ${typeLabel}`, e);
        return [];
    }
}

// Audio Books
export async function fetchAudioBooks(query: string = 'history', page: number = 1, sort: string = 'default'): Promise<AssetItem[]> {
    return fetchInternetArchive(query, 'mediatype:audio AND subject:audiobooks', page, 'AudioBooks', sort);
}

// Periodicals & E-Newspapers
export async function fetchPeriodicals(query: string = 'times', page: number = 1, sort: string = 'default'): Promise<AssetItem[]> {
    return fetchInternetArchive(query, '(collection:periodicals OR collection:newspapers)', page, 'Periodicals', sort);
}
