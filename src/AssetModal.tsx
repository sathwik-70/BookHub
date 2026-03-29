import { X, ExternalLink, Star, Share2 } from 'lucide-react';
import type { AssetItem } from './api';
import { showToast } from './Toast';

interface AssetModalProps {
    item: AssetItem | null;
    onClose: () => void;
    isSaved: boolean;
    onToggleSave: () => void;
}

export function AssetModal({ item, onClose, isSaved, onToggleSave }: AssetModalProps) {
    if (!item) return null;

    const handleShare = async () => {
        try {
            const shareText = `Check out this artifact on BookHub:\n\n${item.title}\n${item.sourceUrl}`;
            await navigator.clipboard.writeText(shareText);
            showToast("Link copied to clipboard!");
        } catch (err) {
            console.error("Failed to copy clipboard:", err);
            showToast("Failed to copy link.", "error");
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-fade-in">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-hub-bg/80 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-4xl max-h-[90vh] glass-panel bg-white/95 overflow-hidden flex flex-col md:flex-row shadow-2xl border-white/60">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 md:top-6 md:right-6 z-10 p-2.5 bg-slate-900/10 hover:bg-slate-900/20 rounded-full text-slate-600 hover:text-slate-900 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-hub-primary"
                >
                    <X size={20} />
                </button>

                {/* Image Section (if available) */}
                {item.imageUrl && item.type !== 'audiobooks' && (
                    <div className="w-full md:w-1/2 h-64 md:h-auto bg-slate-100 flex items-center justify-center border-b md:border-b-0 md:border-r border-slate-200/60 shrink-0">
                        <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-full h-full object-contain"
                            loading="lazy"
                        />
                    </div>
                )}

                {/* Embedded Media Viewer (Audio OR Ebook) */}
                {(item.type === 'audiobooks' || item.type === 'ebooks') && item.mediaUrl && (
                    <div className="w-full md:w-1/2 bg-slate-100 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-200/60 shrink-0 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-200/80 to-transparent z-0" />

                        {item.imageUrl && (
                            <img
                                src={item.imageUrl}
                                alt={item.title}
                                className="absolute inset-0 w-full h-full object-cover opacity-20 blur-xl"
                            />
                        )}

                        <div className="relative z-10 w-full p-4 sm:p-6 flex flex-col h-full justify-center">
                            <h3 className="text-slate-800 font-bold mb-3 text-center">
                                {item.type === 'ebooks' ? 'Document / Web Reader' : 'Audiobook Stream'}
                            </h3>
                            <div className="w-full flex-1 min-h-[300px] bg-slate-200/50 rounded-xl overflow-hidden shadow-2xl border border-slate-300/50">
                                <iframe
                                    src={item.mediaUrl}
                                    width="100%"
                                    height="100%"
                                    frameBorder="0"
                                    allowFullScreen
                                    className="block w-full h-full min-h-[300px]"
                                ></iframe>
                            </div>
                        </div>
                    </div>
                )}

                {/* Text/Details Section */}
                <div className={`p-6 md:p-10 flex flex-col overflow-y-auto ${item.imageUrl ? 'md:w-1/2' : 'w-full'}`}>
                    <div className="flex items-center justify-between mb-6">
                        <span className="text-sm font-bold text-hub-primary uppercase tracking-wider">
                            {item.type} Artifact
                        </span>

                        <button
                            onClick={onToggleSave}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-hub-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#f8fafc] ${isSaved ? 'text-yellow-600 bg-yellow-400/20 border border-yellow-400/30' : 'text-slate-600 bg-slate-900/5 border border-slate-200/60 hover:bg-slate-900/10'}`}
                        >
                            <Star size={16} fill={isSaved ? "currentColor" : "none"} />
                            {isSaved ? 'Saved' : 'Save'}
                        </button>
                    </div>

                    <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-3 leading-tight tracking-tight">
                        {item.title}
                    </h2>

                    {item.author && (
                        <p className="text-lg text-hub-secondary font-medium mb-4">
                            {item.author}
                        </p>
                    )}

                    {item.date && (
                        <div className="text-sm text-slate-500 mb-6 bg-slate-900/5 inline-block px-3 py-1 rounded-lg">
                            Date: {item.date}
                        </div>
                    )}

                    <div className="prose prose-sm sm:prose-base text-slate-700 mb-8 whitespace-pre-wrap leading-relaxed">
                        {item.description || "No detailed description available for this artifact."}
                    </div>

                    <div className="mt-auto pt-6 border-t border-slate-200/60 flex flex-col sm:flex-row gap-4">
                        <a
                            href={item.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 bg-gradient-to-r from-hub-primary to-hub-secondary text-white font-medium py-3 px-6 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-[0_0_20px_rgba(236,72,153,0.3)] hover:shadow-[0_0_30px_rgba(236,72,153,0.5)] hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f8fafc] focus-visible:ring-hub-primary"
                        >
                            Access Original Source
                            <ExternalLink size={18} />
                        </a>

                        {item.type === 'ebooks' && (
                            <a
                                href={`https://www.amazon.com/s?k=${encodeURIComponent(item.title + ' ' + (item.author || ''))}&tag=ivorypicksco-21`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="sm:w-auto w-full bg-[#FF9900] text-slate-900 font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 hover:bg-[#FF9900]/90 transition-all shadow-lg hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f8fafc] focus-visible:ring-[#FF9900]"
                            >
                                Buy on Amazon
                                <ExternalLink size={18} />
                            </a>
                        )}

                        <button
                            onClick={handleShare}
                            className={`${item.type !== 'ebooks' ? 'flex-1' : 'sm:w-auto w-full'} bg-slate-900/5 hover:bg-slate-900/10 border border-slate-200/60 text-slate-800 font-medium py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f8fafc] focus-visible:ring-hub-primary`}
                        >
                            Share Link
                            <Share2 size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
