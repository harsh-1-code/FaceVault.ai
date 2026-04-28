import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface AdminTopbarProps {
  onUpload: () => void;
}

export default function AdminTopbar({ onUpload }: AdminTopbarProps) {
  return (
    <header className="sticky top-0 z-20 bg-[hsl(240_10%_5%)/95] backdrop-blur border-b border-[hsl(var(--border))] px-6 lg:px-8 xl:px-10 2xl:px-12 h-14 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <h1 className="text-[15px] font-bold text-white">Admin Panel</h1>
        <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
          Operations
        </span>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 bg-[hsl(var(--muted))] border border-[hsl(var(--border))] rounded-lg px-3 py-1.5">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs font-medium text-[hsl(var(--muted-foreground))]">Encoding pipeline</span>
          <span className="text-xs font-bold text-green-400">Active</span>
        </div>

        <button
          onClick={onUpload}
          className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 active:scale-[0.98] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all"
        >
          <Icon name="ArrowUpTrayIcon" size={15} />
          Upload Photos
        </button>

        <button className="relative p-2 rounded-lg text-[hsl(var(--muted-foreground))] hover:text-white hover:bg-[hsl(var(--muted))] transition-all">
          <Icon name="BellIcon" size={18} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
        </button>

        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white text-xs font-bold">
          A
        </div>
      </div>
    </header>
  );
}