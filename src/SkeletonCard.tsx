export function SkeletonCard() {
    return (
        <div className="glass-card rounded-2xl flex flex-col h-[400px] overflow-hidden animate-pulse pointer-events-none">
            <div className="h-[200px] w-full bg-slate-200/50 shrink-0" />
            <div className="p-6 flex flex-col flex-grow">
                <div className="w-16 h-4 bg-slate-200/50 rounded mb-3" />
                <div className="w-3/4 h-6 bg-slate-200/50 rounded mb-2" />
                <div className="w-1/2 h-4 bg-slate-200/50 rounded mb-4" />

                <div className="w-full h-3 bg-slate-200/50 rounded mb-2" />
                <div className="w-full h-3 bg-slate-200/50 rounded mb-2" />
                <div className="w-2/3 h-3 bg-slate-200/50 rounded" />

                <div className="w-24 h-4 bg-slate-200/50 rounded mt-5 pt-3 border-t border-slate-200/60" />
            </div>
        </div>
    );
}
