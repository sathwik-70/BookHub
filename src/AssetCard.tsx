import type { AssetItem } from './api';
import { BookOpen, Rocket, FileText, Image, Video, Star, Headphones, Newspaper, Scroll, Smartphone, Layers, ArrowRight } from 'lucide-react';

interface AssetCardProps {
    item: AssetItem;
    isSaved?: boolean;
    onToggleSave?: () => void;
    onClick?: () => void;
}

export function AssetCard({ item, isSaved = false, onToggleSave, onClick }: AssetCardProps) {

    const getIcon = () => {
        switch (item.type) {
            case 'books': return <BookOpen size={16} />;
            case 'space': return <Rocket size={16} />;
            case 'papers': return <FileText size={16} />;
            case 'art': return <Image size={16} />;
            case 'video': return <Video size={16} />;
            case 'ebooks': return <Smartphone size={16} />;
            case 'audiobooks': return <Headphones size={16} />;
            case 'periodicals': return <Newspaper size={16} />;
            case 'manuscripts': return <Scroll size={16} />;
            case 'prints': return <Layers size={16} />;
            default: return <BookOpen size={16} />;
        }
    }

    return (
        <div
            onClick={onClick}
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onClick?.();
                }
            }}
            className="glass-card flex flex-col h-full group overflow-hidden block cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-hub-primary focus-visible:ring-offset-4 focus-visible:ring-offset-white animate-slide-up rounded-2xl"
            style={{ animationFillMode: 'both' }}
        >
            <div className="h-[200px] w-full bg-slate-100/50 flex flex-col items-center justify-center relative overflow-hidden shrink-0">
                {item.imageUrl ? (
                    <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                        loading="lazy"
                        onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                            (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                        }}
                    />
                ) : null}

                <div className={`absolute inset-0 flex items-center justify-center ${item.imageUrl ? 'hidden' : ''}`}>
                    <div className="text-slate-300 group-hover:scale-110 transition-transform duration-500">
                        {getIcon()}
                    </div>
                </div>

            </div>

            <div className="p-5 flex-1 flex flex-col h-[200px]">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-hub-primary uppercase tracking-wider flex items-center gap-1">
                        {getIcon()} {item.type}
                    </span>
                    <div className="flex items-center gap-2">
                        {item.date && (
                            <span className="text-xs text-gray-500">{item.date}</span>
                        )}
                        {onToggleSave && (
                            <button
                                aria-label={isSaved ? "Remove from archives" : "Save to archives"}
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    onToggleSave();
                                }}
                                className={`p-1.5 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-hub-primary ${isSaved ? 'text-yellow-500 bg-yellow-400/20' : 'text-slate-400 hover:text-slate-800 hover:bg-slate-900/10'}`}
                                title={isSaved ? "Remove from Archives" : "Save to Archives"}
                            >
                                <Star size={14} fill={isSaved ? "currentColor" : "none"} />
                            </button>
                        )}
                    </div>
                </div>

                <h3 className="text-lg font-bold mb-1 text-slate-900 group-hover:text-hub-secondary transition-colors line-clamp-2" title={item.title}>
                    {item.title}
                </h3>

                {item.author && (
                    <p className="text-sm font-medium text-hub-primary mb-2 line-clamp-1">
                        {item.author}
                    </p>
                )}

                <p className="text-sm text-slate-500 line-clamp-3 mb-4 flex-grow">
                    {item.description}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center text-xs text-hub-primary font-medium group-hover:text-hub-secondary transition-colors">
                    Access Archive
                    <ArrowRight size={14} className="ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </div>
            </div>
        </div>
    );
}
