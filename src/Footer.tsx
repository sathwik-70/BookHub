import { Sparkles, ExternalLink, Mail } from 'lucide-react';

const API_CREDITS = [
    { name: 'Open Library', url: 'https://openlibrary.org/developers/api', color: 'text-green-400' },
    { name: 'NASA Image Library', url: 'https://images.nasa.gov/', color: 'text-blue-400' },
    { name: 'arXiv', url: 'https://arxiv.org/', color: 'text-orange-400' },
    { name: 'Art Institute of Chicago', url: 'https://api.artic.edu/docs/', color: 'text-pink-400' },
];

export function Footer() {
    return (
        <footer className="relative z-10 border-t border-slate-200/60 mt-8 py-12">
            <div className="mx-auto w-full max-w-7xl px-4 md:px-8 xl:px-12 grid grid-cols-1 md:grid-cols-3 gap-8 items-center md:items-start">
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
                    <p className="text-xs text-slate-500 max-w-xs text-center md:text-left">
                        A turnkey curated gateway to the sum of human achievement.
                    </p>
                </div>

                {/* Newsletter (Monetization Placeholder) */}
                <div className="flex flex-col items-center md:items-start gap-3 w-full">
                    <p className="text-sm font-bold text-slate-800 flex items-center gap-2">
                        <Mail size={16} className="text-hub-primary" />
                        Join the Weekly Digest
                    </p>
                    <form className="flex w-full max-w-sm" onSubmit={(e) => { e.preventDefault(); alert('Newsletter signup hooked to your provider!'); }}>
                        <input 
                            type="email" 
                            placeholder="your@email.com" 
                            className="w-full px-4 py-2 text-sm bg-white/50 border border-slate-300 rounded-l-lg focus:outline-none focus:ring-1 focus:ring-hub-primary"
                        />
                        <button type="submit" className="px-4 py-2 bg-slate-800 text-white text-sm font-medium rounded-r-lg hover:bg-slate-900 transition-colors">
                            Subscribe
                        </button>
                    </form>
                    <p className="text-[10px] text-slate-400">Join 10,000+ readers. Unsubscribe anytime.</p>
                </div>

                {/* API Credits */}
                <div className="flex flex-col gap-3 items-center md:items-end w-full">
                    <p className="text-xs text-slate-600 uppercase tracking-widest font-semibold">Powered By Open APIs</p>
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
                    <p className="text-xs text-slate-700">
                        © {new Date().getFullYear()} BookHub. Premium Starter Asset.
                    </p>
                </div>
            </div>
        </footer>
    );
}
