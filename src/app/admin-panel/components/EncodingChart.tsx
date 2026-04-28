'use client';
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, type TooltipProps,  } from 'recharts';
import { encodingThroughputData } from '../data/adminMockData';

function CustomTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="bg-[hsl(240_10%_8%)] border border-[hsl(var(--border))] rounded-xl p-3 shadow-2xl text-xs">
      <p className="font-mono text-[hsl(var(--muted-foreground))] mb-2">{label}</p>
      {payload.map((entry) => (
        <div key={`tooltip-${entry.dataKey}`} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-white font-medium capitalize">{entry.dataKey}:</span>
          <span className="font-mono font-bold" style={{ color: entry.color }}>{entry.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function EncodingChart() {
  return (
    <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl p-5">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="text-sm font-bold text-white">Encoding Throughput</h3>
          <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5">Faces encoded vs queue depth over 24h</p>
        </div>
        <div className="flex items-center gap-1.5 bg-[hsl(var(--muted))] rounded-lg px-2.5 py-1">
          <span className="w-2 h-2 rounded-full bg-violet-400" />
          <span className="text-[10px] font-medium text-[hsl(var(--muted-foreground))]">Encoded</span>
          <span className="w-2 h-2 rounded-full bg-cyan-400 ml-2" />
          <span className="text-[10px] font-medium text-[hsl(var(--muted-foreground))]">Queued</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={encodingThroughputData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="gradEncoded" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradQueued" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 5% 12%)" />
          <XAxis dataKey="time" tick={{ fill: 'hsl(240 5% 55%)', fontSize: 10, fontFamily: 'IBM Plex Mono' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: 'hsl(240 5% 55%)', fontSize: 10, fontFamily: 'IBM Plex Mono' }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="encoded" stroke="#7C3AED" strokeWidth={2} fill="url(#gradEncoded)" />
          <Area type="monotone" dataKey="queued" stroke="#06B6D4" strokeWidth={2} fill="url(#gradQueued)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}