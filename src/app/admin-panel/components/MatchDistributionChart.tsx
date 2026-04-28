'use client';
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  type TooltipProps,
} from 'recharts';
import { matchesPerEventData } from '../data/adminMockData';

function CustomTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="bg-[hsl(240_10%_8%)] border border-[hsl(var(--border))] rounded-xl p-3 shadow-2xl text-xs space-y-1">
      <p className="font-bold text-white">{label}</p>
      {payload.map((entry) => (
        <div key={`bar-tooltip-${entry.dataKey}`} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-[hsl(var(--muted-foreground))] capitalize">{entry.dataKey}:</span>
          <span className="font-mono font-bold text-white">{entry.value}</span>
        </div>
      ))}
    </div>
  );
}

const barColors = ['#7C3AED', '#7C3AED', '#7C3AED', '#7C3AED', '#374151', '#374151'];

export default function MatchDistributionChart() {
  return (
    <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl p-5 h-full">
      <div className="mb-5">
        <h3 className="text-sm font-bold text-white">Matches per Event</h3>
        <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5">Photos delivered to attendees</p>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={matchesPerEventData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 5% 12%)" vertical={false} />
          <XAxis dataKey="event" tick={{ fill: 'hsl(240 5% 55%)', fontSize: 9, fontFamily: 'IBM Plex Mono' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: 'hsl(240 5% 55%)', fontSize: 10, fontFamily: 'IBM Plex Mono' }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="matches" radius={[4, 4, 0, 0]}>
            {matchesPerEventData.map((entry, index) => (
              <Cell key={`cell-match-${entry.event}`} fill={barColors[index] ?? '#374151'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}