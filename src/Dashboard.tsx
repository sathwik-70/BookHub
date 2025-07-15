import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useLocalStorage } from './useLocalStorage'
import type { AssetItem } from './api'
import { Rocket, BookOpen, FileText, Image, Video, Archive, ArrowRight, BarChart as BarChartIcon, PieChart as PieChartIcon, Star, Trash2, Headphones, Newspaper, Scroll, Smartphone, Layers, Download, Upload } from 'lucide-react'
import { showToast } from './Toast'
import { useRef } from 'react'

const COLORS = ['#60A5FA', '#34D399', '#FBBF24', '#F472B6', '#A78BFA'];

export function Dashboard() {
    const [favorites, setFavorites] = useLocalStorage<AssetItem[]>('bookhub-favorites', []);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Calculate metrics
    const typeCounts = useMemo(() => {
        const counts: Record<string, number> = {};
        favorites.forEach(f => {
            counts[f.type] = (counts[f.type] || 0) + 1;
        });
        return Object.entries(counts)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value);
    }, [favorites]);

    const recentItems = useMemo(() => {
        // Assume appended at the end, so reverse to get newest
        return [...favorites].reverse().slice(0, 4);
    }, [favorites]);

    const getIcon = (type: string) => {
        switch (type) {
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
            default: return <Archive size={16} />;
        }
    }

    const handleClearArchives = () => {
        if (window.confirm("Are you sure you want to permanently delete all your saved artifacts? This cannot be undone.")) {
            setFavorites([]);
            showToast("Archives completely cleared.", "info");
        }
    }

    const handleExport = () => {
        if (favorites.length === 0) {
            showToast("Nothing to export.", "info");
            return;
        }
        const dataStr = JSON.stringify(favorites, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'bookhub-archives.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        showToast("Archives exported successfully.");
    }

    const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const importedData = JSON.parse(event.target?.result as string);
                if (Array.isArray(importedData)) {
                    setFavorites(prev => {
                        const newItems = [...prev];
                        let addedCount = 0;
                        importedData.forEach((item: any) => {
                            if (item.id && !newItems.some(f => f.id === item.id)) {
                                newItems.push(item);
                                addedCount++;
                            }
                        });
                        showToast(`Successfully imported ${addedCount} new artifacts.`);
                        return newItems;
                    });
                } else {
                    showToast("Invalid archive format.", "error");
                }
            } catch (err) {
                console.error(err);
                showToast("Failed to parse archive file.", "error");
            }
        };
        reader.readAsText(file);

        // Reset input so the same file can be selected again if needed
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }

    return (
        <div className="mx-auto w-full max-w-7xl px-4 md:px-8 xl:px-12 py-12">
            <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gradient-hub animate-pulse-slow mb-3">
                        Learning Analytics
                    </h1>
                    <p className="text-slate-500 text-lg">Gain insights into your curated collection of human knowledge.</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-900/5 hover:bg-slate-900/10 border border-slate-200/60 rounded-xl transition-colors text-sm font-semibold text-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-hub-primary"
                    >
                        <Upload size={16} />
                        Import
                    </button>
                    <input
                        type="file"
                        accept=".json"
                        style={{ display: 'none' }}
                        ref={fileInputRef}
                        onChange={handleImport}
                    />

                    {favorites.length > 0 && (
                        <>
                            <button
                                onClick={handleExport}
                                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-hub-primary/80 to-hub-secondary/80 hover:from-hub-primary hover:to-hub-secondary text-white rounded-xl transition-all shadow-lg text-sm font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-hub-primary"
                            >
                                <Download size={16} />
                                Export
                            </button>
                            <button
                                onClick={handleClearArchives}
                                className="flex items-center gap-2 px-4 py-2 border border-red-500/30 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors text-sm font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 ml-auto md:ml-0"
                            >
                                <Trash2 size={16} />
                                Clear
                            </button>
                        </>
                    )}
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Key Metrics Overview */}
                <div className="lg:col-span-1 flex flex-col gap-6">
                    <div className="glass-panel p-6 border-l-4 border-l-hub-secondary">
                        <div className="flex items-center gap-3 text-hub-secondary mb-2">
                            <Archive size={20} />
                            <h3 className="font-semibold uppercase tracking-wider text-sm">Total Artifacts</h3>
                        </div>
                        <p className="text-5xl font-black text-slate-900">{favorites.length}</p>
                        <p className="text-xs text-slate-500 mt-2">Saved across all collections in your archive.</p>
                    </div>

                    <div className="glass-panel p-6 flex flex-col h-full border border-slate-200/60 hover:border-hub-primary/30 transition-colors">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3 text-hub-primary">
                                <BarChartIcon size={20} />
                                <h3 className="font-semibold uppercase tracking-wider text-sm">Distribution</h3>
                            </div>
                        </div>

                        {favorites.length > 0 ? (
                            <div className="h-[250px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={typeCounts}
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            {typeCounts.map((_, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '8px' }}
                                            itemStyle={{ color: '#0f172a' }}
                                        />
                                        <Legend
                                            verticalAlign="bottom"
                                            height={36}
                                            iconType="circle"
                                            wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center flex-1 text-slate-400">
                                <PieChartIcon size={48} className="mb-2 opacity-30" />
                                <p className="text-sm">Start saving items to see distribution.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Activity Feed */}
                <div className="lg:col-span-2 glass-panel p-6 md:p-8 flex flex-col border border-slate-200/60">
                    <div className="flex items-center justify-between mb-8 border-b border-slate-200/60 pb-4">
                        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                            <Star className="text-hub-primary" fill="currentColor" /> Recent Discoveries
                        </h2>
                        <Link to="/category/saved" className="text-sm text-hub-secondary hover:text-hub-primary transition-colors flex items-center gap-1">
                            View all <ArrowRight size={14} />
                        </Link>
                    </div>

                    {recentItems.length > 0 ? (
                        <div className="flex flex-col gap-4">
                            {recentItems.map((item) => (
                                <a
                                    href={item.sourceUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    key={item.id}
                                    className="flex items-start md:items-center gap-4 p-4 rounded-xl hover:bg-slate-900/5 transition-colors border border-transparent hover:border-slate-200/60 group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-hub-primary"
                                >
                                    <div className="bg-slate-100 w-16 h-16 md:w-20 md:h-20 rounded-lg shrink-0 flex items-center justify-center overflow-hidden relative">
                                        {item.imageUrl ? (
                                            <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                        ) : (
                                            <div className="text-space-accent">
                                                {getIcon(item.type)}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1 text-xs text-hub-primary font-bold uppercase tracking-wider">
                                            {getIcon(item.type)} {item.type}
                                        </div>
                                        <h4 className="text-slate-900 font-bold leading-tight truncate group-hover:text-hub-primary transition-colors">{item.title}</h4>
                                        <p className="text-slate-500 text-sm truncate mt-1 font-medium">{item.description}</p>
                                    </div>
                                    <div className="hidden md:flex text-slate-400 group-hover:text-slate-900 transition-colors">
                                        <ArrowRight size={20} />
                                    </div>
                                </a>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                            <Archive size={48} className="mb-4 opacity-30" />
                            <p className="mb-4">No recent activity detected.</p>
                            <Link to="/category/books" className="bg-hub-primary hover:bg-hub-primary/80 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                                Explore Archives
                            </Link>
                        </div>
                    )}
                </div>

            </div>
        </div>
    )
}
