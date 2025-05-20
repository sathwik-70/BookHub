import { useState, useEffect, useMemo, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Search, Rocket, BookOpen, FileText, Image, Video, Sparkles, Loader2, Bookmark, Star, Headphones, Newspaper, Scroll, Smartphone, Layers, Filter } from 'lucide-react'
import { fetchBooks, fetchSpaceData, fetchPapers, fetchArt, fetchAudioBooks, fetchPeriodicals, fetchManuscripts } from './api'
import type { AssetItem } from './api'
import { AssetCard } from './AssetCard'
import { AssetModal } from './AssetModal'
import { SkeletonCard } from './SkeletonCard'
import { useLocalStorage } from './useLocalStorage'
import { showToast } from './Toast'

const CATEGORIES = [
    { id: 'saved', name: 'My Archives', icon: Bookmark, desc: 'Your saved and bookmarked artifacts' },
    { id: 'books', name: 'Library of Babel', icon: BookOpen, desc: 'Books, Texts & Manuscripts from Open Library' },
    { id: 'ebooks', name: 'Digital Texts', icon: Smartphone, desc: 'Open-Source Ebooks with Full Text' },
    { id: 'audiobooks', name: 'Audio Archives', icon: Headphones, desc: 'Spoken Word & Audio Books from Internet Archive' },
    { id: 'periodicals', name: 'The Daily Press', icon: Newspaper, desc: 'Historical Newspapers & Periodicals' },
    { id: 'manuscripts', name: 'Ancient Scripts', icon: Scroll, desc: 'Historical Manuscripts from Open Library' },
    { id: 'space', name: 'Cosmic Archives', icon: Rocket, desc: 'Space Imagery from NASA' },
    { id: 'papers', name: 'Scholarly Nexus', icon: FileText, desc: 'Research & Journals from arXiv' },
    { id: 'art', name: 'Gallery of Antiquity', icon: Image, desc: 'Artwork from Art Institute of Chicago' },
    { id: 'prints', name: 'Lithographs & Prints', icon: Layers, desc: 'Classical Prints from Art Institute of Chicago' },
    { id: 'video', name: 'Stellar Cinema', icon: Video, desc: 'Video & Documentaries from NASA' },
];

export function LibraryBrowser() {
    const { categoryId } = useParams();
    const navigate = useNavigate();
    const activeTab = categoryId || 'books';

    const [searchQuery, setSearchQuery] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [items, setItems] = useState<AssetItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [loadingMore, setLoadingMore] = useState(false);
    const [selectedItem, setSelectedItem] = useState<AssetItem | null>(null);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [sortOrder, setSortOrder] = useState('default');
    const observerTarget = useRef<HTMLDivElement>(null);

    // Persisted State
    const [favorites, setFavorites] = useLocalStorage<AssetItem[]>('bookhub-favorites', []);
    const [recentSearches, setRecentSearches] = useLocalStorage<string[]>('bookhub-recent-searches', []);

    // Fetch data whenever tab, search query, or page changes
    useEffect(() => {
        let isMounted = true;
        const loadData = async () => {
            if (page === 1) {
                setLoading(true);
                setItems([]);
            } else {
                setLoadingMore(true);
            }

            let data: AssetItem[] = [];
            const query = searchQuery.trim() || undefined;

            try {
                switch (activeTab) {
                    case 'saved':
                        data = [];
                        break;
                    case 'books':
                        data = await fetchBooks(query, page, false, sortOrder);
                        break;
                    case 'ebooks':
                        data = await fetchBooks(query, page, true, sortOrder);
                        break;
                    case 'audiobooks':
                        data = await fetchAudioBooks(query, page, sortOrder);
                        break;
                    case 'periodicals':
                        data = await fetchPeriodicals(query, page, sortOrder);
                        break;
                    case 'manuscripts':
                        data = await fetchManuscripts(query, page, sortOrder);
                        break;
                    case 'space':
                        data = await fetchSpaceData(query, 'image', page, sortOrder);
                        break;
                    case 'papers':
                        data = await fetchPapers(query, page, sortOrder);
                        break;
                    case 'art':
                        data = await fetchArt(query, page, false, sortOrder);
                        break;
                    case 'prints':
                        data = await fetchArt(query, page, true, sortOrder);
                        break;
                    case 'video':
                        data = await fetchSpaceData(query || 'moon', 'video', page, sortOrder);
                        break;
                }
            } catch (err) {
                console.error("Error loading data", err);
            }

            if (isMounted) {
                if (page === 1) {
                    setItems(data);
                } else {
                    setItems(prev => [...prev, ...data]);
                }
                setLoading(false);
                setLoadingMore(false);
            }
        };

        loadData();
        return () => { isMounted = false };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab, searchQuery, page, sortOrder]);

    // Infinite Scroll Intersection Observer
    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting && !loading && !loadingMore && items.length > 0 && items.length % 12 === 0 && activeTab !== 'saved') {
                    setPage(p => p + 1);
                }
            },
            { threshold: 1.0 }
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => {
            if (observerTarget.current) {
                observer.unobserve(observerTarget.current);
            }
        };
    }, [observerTarget, loading, loadingMore, items, activeTab]);

    const displayedItems = useMemo(() => {
        if (activeTab !== 'saved') return items;
        const query = searchQuery.trim().toLowerCase();
        return query
            ? favorites.filter(f => f.title.toLowerCase().includes(query) || f.description.toLowerCase().includes(query))
            : favorites;
    }, [activeTab, items, favorites, searchQuery]);

    const handleSearch = (e?: React.FormEvent, explicitQuery?: string) => {
        if (e) e.preventDefault();

        const q = explicitQuery ?? searchInput;

        // Only save to recent searches if there's actually a query
        if (q.trim()) {
            setRecentSearches(prev => {
                const filtered = prev.filter(s => s.toLowerCase() !== q.toLowerCase());
                return [q, ...filtered].slice(0, 5); // Keep last 5
            });
        }

        setPage(1);
        setSearchInput(q);
        setSearchQuery(q);
        setIsSearchFocused(false);
    };

    const handleTabChange = (tabId: string) => {
        navigate(`/category/${tabId}`);
        setPage(1);
        setSearchInput('');
        setSearchQuery('');
    }

    const toggleFavorite = (item: AssetItem) => {
        setFavorites(prev => {
            const exists = prev.find(f => f.id === item.id);
            if (exists) {
                showToast(`"${item.title}" removed from archives`, 'info');
                return prev.filter(f => f.id !== item.id);
            }
            showToast(`"${item.title}" saved to archives!`);
            return [...prev, item];
        });
    }

    // Lock body scroll & handle Escape key when modal is open
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setSelectedItem(null);
        };
        if (selectedItem) {
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', handleKeyDown);
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [selectedItem]);

    return (
        <div className="w-full">
            <main className="mx-auto w-full max-w-7xl px-4 md:px-8 xl:px-12 flex flex-col gap-16">
                {/* Hero & Search Section */}
                <section className="text-center flex flex-col items-center gap-8 mt-16 mb-4 animate-fade-in relative z-10">
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-tight max-w-4xl">
                        A Universal Catalog of <br />
                        <span className="text-gradient-hub animate-pulse-slow">
                            Human Knowledge
                        </span>
                    </h1>
                    <p className="text-slate-500 text-lg md:text-xl max-w-2xl px-4 leading-relaxed font-medium">
                        Search across open-source books, NASA archives, scholarly papers, and curated art collections.
                    </p>

                    <div className="w-full max-w-4xl mt-4 relative flex flex-col md:flex-row items-stretch justify-center gap-3">
                        <form onSubmit={handleSearch} className="flex-1 relative group">
                            <div className="absolute inset-0 bg-hub-primary/20 blur-xl rounded-full group-hover:bg-hub-primary/30 transition-colors duration-500" />
                            <div className="relative flex items-center bg-white/60 border border-slate-200/60 rounded-full h-full overflow-hidden focus-within:border-hub-primary/50 focus-within:bg-white/90 transition-all shadow-xl z-20">
                                <div className="pl-6 text-slate-500">
                                    <Search size={22} />
                                </div>
                                <input
                                    type="text"
                                    placeholder={`Search ${CATEGORIES.find(c => c.id === activeTab)?.name.toLowerCase()}...`}
                                    className="w-full bg-transparent border-none py-4 px-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-0 text-lg h-full max-h-[60px]"
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    onFocus={() => setIsSearchFocused(true)}
                                    onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)} // delay to allow clicks
                                    style={{ height: '60px' }}
                                />
                                <button type="submit" className="bg-hub-primary hover:bg-hub-primary/80 text-white font-medium px-8 h-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-hub-primary h-[60px] flex items-center justify-center min-h-full">
                                    Search
                                </button>
                            </div>

                            {/* Recent Searches Dropdown */}
                            {isSearchFocused && recentSearches.length > 0 && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200/60 rounded-2xl shadow-2xl z-30 overflow-hidden animate-fade-in text-left">
                                    <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
                                        <span className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Recent Searches</span>
                                        <button
                                            type="button"
                                            onMouseDown={(e) => { e.preventDefault(); setRecentSearches([]); }}
                                            className="text-xs text-slate-400 hover:text-red-500 transition-colors"
                                        >
                                            Clear
                                        </button>
                                    </div>
                                    <ul>
                                        {recentSearches.map((term, idx) => (
                                            <li key={idx}>
                                                <button
                                                    type="button"
                                                    onMouseDown={(e) => {
                                                        e.preventDefault(); // Prevent blur
                                                        handleSearch(undefined, term);
                                                    }}
                                                    className="w-full text-left px-5 py-3 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors flex items-center gap-3"
                                                >
                                                    <Search size={14} className="text-slate-400" />
                                                    {term}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </form>

                        {/* Sort Dropdown */}
                        <div className="relative shrink-0 w-full md:w-auto mt-2 md:mt-0 z-20 shadow-xl border border-slate-200/60 rounded-full md:rounded-xl focus-within:border-hub-primary/50 overflow-hidden bg-white/60 group hover:border-slate-300 transition-colors">
                            <select
                                title="Sort artifacts"
                                value={sortOrder}
                                onChange={(e) => { setSortOrder(e.target.value); setPage(1); }}
                                className="w-full md:w-[180px] bg-transparent text-slate-900 pl-4 pr-12 py-4 h-[60px] font-medium focus:outline-none appearance-none cursor-pointer outline-none"
                            >
                                <option value="default">Relevance</option>
                                <option value="newest">Newest First</option>
                                <option value="oldest">Oldest First</option>
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-hub-secondary group-hover:text-hub-primary transition-colors">
                                <Filter size={20} />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Content Tabs Header */}
                <div className="flex justify-center md:justify-start overflow-x-auto pb-4 gap-3 no-scrollbar border-b border-slate-200/60 relative z-10 w-full mb-4">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => handleTabChange(cat.id)}
                            className={`whitespace-nowrap px-5 py-3.5 rounded-xl text-sm font-semibold flex-shrink-0 transition-all flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-hub-primary focus-visible:ring-offset-2 focus-visible:ring-offset-white ${activeTab === cat.id ? 'bg-gradient-to-r from-hub-primary/20 to-hub-secondary/20 text-slate-900 border border-hub-primary/30 shadow-[0_0_20px_rgba(236,72,153,0.2)] scale-105' : 'bg-slate-900/5 text-slate-500 border border-transparent hover:bg-slate-900/10 hover:text-slate-800'
                                }`}
                        >
                            <cat.icon size={16} />
                            {cat.name}
                        </button>
                    ))}
                </div>

                {/* Data Grid Section */}
                <section className="min-h-[50vh] relative z-10 mb-24">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-3xl font-bold flex items-center gap-3 tracking-tight text-slate-900">
                            {CATEGORIES.find(c => c.id === activeTab)?.icon && (() => {
                                const Icon = CATEGORIES.find(c => c.id === activeTab)?.icon || Sparkles;
                                return <Icon className="text-hub-primary" size={32} />
                            })()}
                            {CATEGORIES.find(c => c.id === activeTab)?.name}
                        </h2>
                        <p className="text-slate-500 font-medium hidden sm:block">
                            {CATEGORIES.find(c => c.id === activeTab)?.desc}
                        </p>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pointer-events-none">
                            {/* Render 12 skeletons to match API limit */}
                            {Array.from({ length: 12 }).map((_, i) => (
                                <SkeletonCard key={i} />
                            ))}
                        </div>
                    ) : displayedItems.length === 0 ? (
                        <div className="w-full h-64 flex flex-col items-center justify-center glass-panel text-slate-500 gap-3">
                            {activeTab === 'saved' ? (
                                <>
                                    <Star size={48} className="opacity-20" />
                                    <p className="font-semibold text-lg text-slate-400">Your archives are empty.</p>
                                    <p className="text-sm text-slate-500 text-center max-w-xs">Star any artifact from the other categories to save it here for later.</p>
                                    <button onClick={() => handleTabChange('books')} className="mt-2 text-space-accent hover:underline text-sm">Browse Library of Babel →</button>
                                </>
                            ) : (
                                <>
                                    <Search size={48} className="mb-4 opacity-50" />
                                    <p>No records found in this sector.</p>
                                    <button
                                        onClick={() => { setSearchInput(''); setSearchQuery(''); }}
                                        className="mt-4 text-space-accent hover:underline"
                                    >
                                        Clear Search
                                    </button>
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {displayedItems.map((item, idx) => {
                                const isSaved = favorites.some(f => f.id === item.id);
                                return (
                                    <div key={`${item.id}-${idx}`} className="animate-fade-in" style={{ animationDelay: `${(idx % 12) * 50}ms` }}>
                                        <AssetCard
                                            item={item}
                                            isSaved={isSaved}
                                            onToggleSave={() => toggleFavorite(item)}
                                            onClick={() => setSelectedItem(item)}
                                        />
                                    </div>
                                )
                            })}
                        </div>
                    )}

                    {/* Infinite Scroll Target */}
                    {!loading && items.length > 0 && items.length % 12 === 0 && activeTab !== 'saved' && (
                        <div ref={observerTarget} className="mt-12 flex justify-center pb-12 w-full h-24">
                            {loadingMore && (
                                <div className="text-hub-primary flex items-center gap-3 font-medium bg-white/80 px-6 py-3 rounded-full border border-hub-primary/30 shadow-[0_0_20px_rgba(236,72,153,0.2)]">
                                    <Loader2 size={24} className="animate-spin" /> Deep Space Scanning...
                                </div>
                            )}
                        </div>
                    )}
                </section>
            </main>

            {/* Detail Modal Overlay */}
            {selectedItem && (
                <AssetModal
                    item={selectedItem}
                    onClose={() => setSelectedItem(null)}
                    isSaved={favorites.some(f => f.id === selectedItem.id)}
                    onToggleSave={() => toggleFavorite(selectedItem)}
                />
            )}
        </div>
    )
}
