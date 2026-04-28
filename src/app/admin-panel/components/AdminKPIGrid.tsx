import React from 'react';
import Icon from '@/components/ui/AppIcon';
import { type AdminEvent } from '../data/adminMockData';

interface AdminKPIGridProps {
  events: AdminEvent[];
}

export default function AdminKPIGrid({ events }: AdminKPIGridProps) {
  const totalPhotos = events.reduce((s, e) => s + e.photosUploaded, 0);
  const totalFaces = events.reduce((s, e) => s + e.facesEncoded, 0);
  const totalMatches = events.reduce((s, e) => s + e.matchesDelivered, 0);
  const totalAttendees = events.reduce((s, e) => s + e.registeredAttendees, 0);
  const completedEvents = events.filter(e => e.status === 'complete').length;
  const queueDepth = events.filter(e => e.status === 'processing' || e.status === 'queued').length;
  const failedEvents = events.filter(e => e.status === 'failed').length;
  const avgAccuracy = events.filter(e => e.accuracy > 0).reduce((s, e, _, arr) => s + e.accuracy / arr.length, 0);
  const totalStorageGb = (events.reduce((s, e) => s + e.storageUsedMb, 0) / 1024).toFixed(1);

  // Grid plan: 6 cards → grid-cols-3 × 2 rows
  // Row 1: hero (events, spans 1) + photos + faces
  // Row 2: matches + accuracy (alert state if < 95) + queue
  const cards = [
    {
      key: 'kpi-events',
      label: 'Total Events',
      value: events.length.toString(),
      subValue: `${completedEvents} complete`,
      icon: 'CalendarDaysIcon',
      trend: null,
      color: 'text-violet-400',
      bg: 'bg-violet-500/10 border-violet-500/20',
      iconBg: 'bg-violet-500/20',
      hero: true,
    },
    {
      key: 'kpi-photos',
      label: 'Photos Uploaded',
      value: totalPhotos.toLocaleString(),
      subValue: `${totalStorageGb} GB stored`,
      icon: 'PhotoIcon',
      trend: '+12%',
      trendUp: true,
      color: 'text-cyan-400',
      bg: 'bg-[hsl(var(--card))] border-[hsl(var(--border))]',
      iconBg: 'bg-cyan-500/10',
      hero: false,
    },
    {
      key: 'kpi-faces',
      label: 'Faces Encoded',
      value: totalFaces.toLocaleString(),
      subValue: 'Precomputed vectors',
      icon: 'CpuChipIcon',
      trend: null,
      color: 'text-blue-400',
      bg: 'bg-[hsl(var(--card))] border-[hsl(var(--border))]',
      iconBg: 'bg-blue-500/10',
      hero: false,
    },
    {
      key: 'kpi-matches',
      label: 'Matches Delivered',
      value: totalMatches.toLocaleString(),
      subValue: `to ${totalAttendees} attendees`,
      icon: 'SparklesIcon',
      trend: '+8%',
      trendUp: true,
      color: 'text-green-400',
      bg: 'bg-green-500/5 border-green-500/15',
      iconBg: 'bg-green-500/10',
      hero: false,
    },
    {
      key: 'kpi-accuracy',
      label: 'Avg Match Accuracy',
      value: `${avgAccuracy.toFixed(1)}%`,
      subValue: avgAccuracy >= 95 ? 'Excellent' : 'Needs attention',
      icon: 'ChartBarIcon',
      trend: null,
      color: avgAccuracy >= 95 ? 'text-green-400' : 'text-amber-400',
      bg: avgAccuracy >= 95 ? 'bg-[hsl(var(--card))] border-[hsl(var(--border))]' : 'bg-amber-500/8 border-amber-500/20',
      iconBg: avgAccuracy >= 95 ? 'bg-green-500/10' : 'bg-amber-500/10',
      hero: false,
    },
    {
      key: 'kpi-queue',
      label: 'Processing Queue',
      value: queueDepth.toString(),
      subValue: failedEvents > 0 ? `${failedEvents} failed — needs review` : 'No failures',
      icon: 'ArrowPathIcon',
      trend: null,
      color: failedEvents > 0 ? 'text-red-400' : 'text-[hsl(var(--muted-foreground))]',
      bg: failedEvents > 0 ? 'bg-red-500/8 border-red-500/20' : 'bg-[hsl(var(--card))] border-[hsl(var(--border))]',
      iconBg: failedEvents > 0 ? 'bg-red-500/10' : 'bg-[hsl(var(--muted))]',
      hero: false,
      alert: failedEvents > 0,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-6 gap-4">
      {cards.map((card) => (
        <div
          key={card.key}
          className={`rounded-2xl border p-5 flex flex-col gap-3 ${card.bg} ${card.hero ? 'sm:col-span-2 lg:col-span-1 2xl:col-span-2' : ''}`}
        >
          <div className="flex items-start justify-between">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${card.iconBg}`}>
              <Icon name={card.icon as Parameters<typeof Icon>[0]['name']} size={18} className={card.color} />
            </div>
            {card.trend && (
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${card.trendUp ? 'bg-green-500/15 text-green-400' : 'bg-red-500/15 text-red-400'}`}>
                {card.trend}
              </span>
            )}
            {(card as { alert?: boolean }).alert && (
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 flex items-center gap-1">
                <Icon name="ExclamationTriangleIcon" size={10} />
                Alert
              </span>
            )}
          </div>
          <div>
            <p className={`text-2xl font-bold tabular-nums font-mono ${card.color}`}>{card.value}</p>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))] mt-0.5">{card.label}</p>
          </div>
          <p className="text-xs text-[hsl(var(--muted-foreground))]">{card.subValue}</p>
        </div>
      ))}
    </div>
  );
}