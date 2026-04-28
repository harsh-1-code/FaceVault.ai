import React from 'react';
import Icon from '@/components/ui/AppIcon';
import Link from 'next/link';

export default function DashboardTopbar() {
  return (
    <header className="sticky top-0 z-20 bg-[hsl(240_10%_5%)/95] backdrop-blur border-b border-[hsl(var(--border))] px-6 lg:px-8 xl:px-10 2xl:px-12 h-14 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <h1 className="text-[15px] font-bold text-white">My Photos</h1>
        <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-full">
          Privacy Protected
        </span>
      </div>
      <div className="flex items-center gap-3">
        <button className="relative p-2 rounded-lg text-[hsl(var(--muted-foreground))] hover:text-white hover:bg-[hsl(var(--muted))] transition-all">
          <Icon name="BellIcon" size={18} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-violet-500 rounded-full" />
        </button>
        <Link
          href="/sign-up-login-screen"
          className="flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))] hover:text-white transition-colors"
        >
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">
            R
          </div>
          <span className="hidden sm:block font-medium">Riya Sharma</span>
        </Link>
      </div>
    </header>
  );
}