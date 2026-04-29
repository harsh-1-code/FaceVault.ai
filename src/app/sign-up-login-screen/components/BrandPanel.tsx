import React from 'react';
import AppLogo from '@/components/ui/AppLogo';

const trustBadges = [
  { key: 'badge-privacy', icon: '🔐', label: 'Privacy-First Architecture' },
  { key: 'badge-ai', icon: '🧠', label: 'AI-Powered Face Recognition' },
  { key: 'badge-instant', icon: '⚡', label: 'Instant Photo Retrieval' },
  { key: 'badge-secure', icon: '🛡️', label: 'No Unauthorized Access' },
];

const stats = [
  { key: 'stat-accuracy', value: '99.2%', label: 'Match Accuracy' },
  { key: 'stat-events', value: '2,400+', label: 'Events Processed' },
  { key: 'stat-photos', value: '1.2M+', label: 'Photos Delivered' },
];

export default function BrandPanel() {
  return (
    <div className="hidden lg:flex lg:w-[52%] xl:w-[55%] relative flex-col justify-between bg-[hsl(240_10%_4%)] border-r border-[hsl(var(--border))] p-12 overflow-hidden">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      {/* Glow orbs */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-cyan-500/8 rounded-full blur-3xl pointer-events-none" />
      {/* Logo */}
      <div className="relative z-10">
        <div className="flex items-center gap-3">
          <AppLogo size={40} />
          <div>
            <span className="font-bold text-xl tracking-tight text-white">FaceVault</span>
            <span className="text-violet-400 font-bold text-xl"> AI</span>
          </div>
        </div>
      </div>
      {/* Hero content */}
      <div className="relative z-10 space-y-8">
        {/* Face scan visual */}
        <div className="relative w-48 h-48 mx-auto">
          <div className="absolute inset-0 rounded-full border-2 border-violet-500/30 animate-pulse-slow" />
          <div className="absolute inset-4 rounded-full border border-cyan-500/20" />
          <div className="absolute inset-0 flex items-center justify-center scan-line rounded-full overflow-hidden bg-violet-900/10">
            <svg viewBox="0 0 120 120" className="w-32 h-32 opacity-60" fill="none">
              {/* Face outline */}
              <ellipse cx="60" cy="55" rx="28" ry="32" stroke="#7C3AED" strokeWidth="1.5" />
              {/* Eyes */}
              <circle cx="50" cy="48" r="4" stroke="#06B6D4" strokeWidth="1.5" />
              <circle cx="70" cy="48" r="4" stroke="#06B6D4" strokeWidth="1.5" />
              {/* Nose */}
              <path d="M60 52 L57 62 L63 62" stroke="#7C3AED" strokeWidth="1" strokeLinecap="round" />
              {/* Mouth */}
              <path d="M52 68 Q60 74 68 68" stroke="#7C3AED" strokeWidth="1.5" strokeLinecap="round" fill="none" />
              {/* Corner brackets */}
              <path d="M8 8 L8 20 M8 8 L20 8" stroke="#A78BFA" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
              <path d="M112 8 L112 20 M112 8 L100 8" stroke="#A78BFA" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
              <path d="M8 112 L8 100 M8 112 L20 112" stroke="#A78BFA" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
              <path d="M112 112 L112 100 M112 112 L100 112" stroke="#A78BFA" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
              {/* Scan lines */}
              <line x1="8" y1="55" x2="32" y2="55" stroke="#06B6D4" strokeWidth="0.8" opacity="0.5" />
              <line x1="88" y1="55" x2="112" y2="55" stroke="#06B6D4" strokeWidth="0.8" opacity="0.5" />
              {/* Dots */}
              <circle cx="60" cy="15" r="2" fill="#06B6D4" opacity="0.7" />
              <circle cx="60" cy="95" r="2" fill="#06B6D4" opacity="0.7" />
            </svg>
          </div>
          {/* Rotating ring */}
          <div
            className="absolute inset-0 rounded-full border border-dashed border-violet-500/20"
            style={{ animation: 'spin 20s linear infinite' }}
          />
        </div>

        <div className="text-center space-y-3">
          <h1 className="text-3xl xl:text-4xl font-bold text-white leading-tight">
            Where Your Memories<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">Find You</span>
          </h1>
          <p className="text-[hsl(var(--muted-foreground))] text-sm leading-relaxed max-w-sm mx-auto">
            Your face is your key. FaceVault AI scans thousands of event photos and delivers only yours — privately, instantly, automatically.
          </p>
        </div>

        {/* Trust badges */}
        <div className="grid grid-cols-2 gap-3">
          {trustBadges?.map((badge) => (
            <div
              key={badge?.key}
              className="flex items-center gap-2.5 bg-[hsl(var(--muted))/50] border border-[hsl(var(--border))] rounded-lg px-3 py-2.5"
            >
              <span className="text-lg">{badge?.icon}</span>
              <span className="text-xs font-medium text-[hsl(var(--muted-foreground))]">{badge?.label}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Stats */}
      <div className="relative z-10 flex gap-6">
        {stats?.map((stat) => (
          <div key={stat?.key} className="text-center">
            <p className="text-2xl font-bold text-white tabular-nums font-mono">{stat?.value}</p>
            <p className="text-[10px] font-medium text-[hsl(var(--muted-foreground))] uppercase tracking-wider mt-0.5">{stat?.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
