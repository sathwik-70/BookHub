import { Sparkles, ExternalLink } from 'lucide-react';

const API_CREDITS = [
    { name: 'Open Library', url: 'https://openlibrary.org/developers/api', color: 'text-green-400' },
    { name: 'NASA Image Library', url: 'https://images.nasa.gov/', color: 'text-blue-400' },
    { name: 'arXiv', url: 'https://arxiv.org/', color: 'text-orange-400' },
    { name: 'Art Institute of Chicago', url: 'https://api.artic.edu/docs/', color: 'text-pink-400' },
];

export function Footer() {
    return (
        <footer className="relative z-10 border-t border-slate-200/60 mt-8 py-12">
            <div className="mx-auto w-full max-w-7xl px-4 md:px-8 xl:px-12 flex flex-col md:flex-row items-center justify-between gap-8">
                {/* Branding */}
                <div className="flex flex-col items-center md:items-start gap-2">
                    <div className="flex items-center gap-3">
                        <div className="bg-hub-primary/20 p-1.5 rounded-lg text-hub-primary">
                            <Sparkles size={18} />
                        </div>
                        <span className="text-lg font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-hub-primary to-hub-secondary">
                            BookHub
                        </span>
                    </div>
                    <p className="text-xs text-gray-500 max-w-xs text-center md:text-left">
                        A beautifully curated gateway to the sum of human achievement.
                    </p>
                </div>

                {/* API Credits */}
                <div className="flex flex-col gap-3 items-center md:items-end">
                    <p className="text-xs text-gray-600 uppercase tracking-widest font-semibold">Powered By Open APIs</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-2 justify-center md:justify-end">
                        {API_CREDITS.map(api => (
                            <a
                                key={api.name}
                                href={api.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`flex items-center gap-1 text-xs font-medium ${api.color} hover:underline opacity-70 hover:opacity-100 transition-opacity`}
                            >
                                {api.name}
                                <ExternalLink size={10} />
                            </a>
                        ))}
                    </div>
                    <p className="text-xs text-gray-700">
                        © {new Date().getFullYear()} BookHub. For educational use.
                    </p>
                </div>
            </div>
        </footer>
    );
}
