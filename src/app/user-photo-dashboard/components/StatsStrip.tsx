import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface StatsStripProps {
  photoCount: number;
  eventCount: number;
}

export default function StatsStrip({ photoCount, eventCount }: StatsStripProps) {
  const stats = [
    { key: 'stat-photos', icon: 'PhotoIcon', value: photoCount.toString(), label: 'Photos Found', color: 'text-violet-400' },
    { key: 'stat-events', icon: 'CalendarIcon', value: eventCount.toString(), label: 'Events Attended', color: 'text-cyan-400' },
    { key: 'stat-accuracy', icon: 'SparklesIcon', value: '97.2%', label: 'Avg Match Confidence', color: 'text-green-400' },
    { key: 'stat-updated', icon: 'ClockIcon', value: '2 min ago', label: 'Last Scanned', color: 'text-[hsl(var(--muted-foreground))]' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map((stat) => (
        <div
          key={stat.key}
          className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl px-4 py-3 flex items-center gap-3"
        >
          <div className="w-8 h-8 rounded-lg bg-[hsl(var(--muted))] flex items-center justify-center shrink-0">
            <Icon name={stat.icon as Parameters<typeof Icon>[0]['name']} size={16} className={stat.color} />
          </div>
          <div>
            <p className={`text-lg font-bold tabular-nums font-mono ${stat.color}`}>{stat.value}</p>
            <p className="text-[11px] font-medium text-[hsl(var(--muted-foreground))] whitespace-nowrap">{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}