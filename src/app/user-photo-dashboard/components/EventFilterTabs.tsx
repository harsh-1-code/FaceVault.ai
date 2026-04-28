'use client';
import React from 'react';
import { type Event } from '../data/mockData';

interface EventFilterTabsProps {
  events: Event[];
  selected: string;
  onSelect: (id: string) => void;
  photoCounts: Record<string, number>;
}

const eventTypeColors: Record<string, string> = {
  wedding: 'text-pink-400',
  corporate: 'text-blue-400',
  college: 'text-amber-400',
  conference: 'text-cyan-400',
  alumni: 'text-green-400',
};

export default function EventFilterTabs({ events, selected, onSelect, photoCounts }: EventFilterTabsProps) {
  const totalCount = Object.values(photoCounts).reduce((s, c) => s + c, 0);

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onSelect('all')}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
          selected === 'all' ?'bg-violet-600/20 text-violet-300 border border-violet-500/40' :'bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] hover:text-white border border-[hsl(var(--border))]'
        }`}
      >
        All Events
        <span className={`text-xs font-bold tabular-nums px-1.5 py-0.5 rounded-full ${selected === 'all' ? 'bg-violet-500/20 text-violet-300' : 'bg-[hsl(var(--background))] text-[hsl(var(--muted-foreground))]'}`}>
          {totalCount}
        </span>
      </button>

      {events.map((event) => (
        <button
          key={`tab-${event.id}`}
          onClick={() => onSelect(event.id)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all max-w-[220px] ${
            selected === event.id
              ? 'bg-violet-600/20 text-violet-300 border border-violet-500/40'
              : 'bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] hover:text-white border border-[hsl(var(--border))]'
          }`}
        >
          <span className={`text-[10px] font-bold uppercase ${eventTypeColors[event.type] || 'text-white'}`}>
            {event.type}
          </span>
          <span className="truncate">{event.name}</span>
          <span className={`shrink-0 text-xs font-bold tabular-nums px-1.5 py-0.5 rounded-full ${selected === event.id ? 'bg-violet-500/20 text-violet-300' : 'bg-[hsl(var(--background))] text-[hsl(var(--muted-foreground))]'}`}>
            {photoCounts[event.id] ?? 0}
          </span>
        </button>
      ))}
    </div>
  );
}