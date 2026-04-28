'use client';
import React from 'react';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';
import { type Photo } from '../data/mockData';

interface PhotoGridProps {
  photos: Photo[];
  onPhotoClick: (photo: Photo) => void;
}

const confidenceColor = (score: number) => {
  if (score >= 95) return 'bg-green-500/20 text-green-400 border-green-500/30';
  if (score >= 88) return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
  return 'bg-red-500/20 text-red-400 border-red-500/30';
};

const matchTypeLabel: Record<Photo['matchType'], string> = {
  primary: 'Primary',
  group: 'Group',
  background: 'Background',
};

export default function PhotoGrid({ photos, onPhotoClick }: PhotoGridProps) {
  if (photos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-[hsl(var(--muted))] flex items-center justify-center mb-4">
          <Icon name="PhotoIcon" size={28} className="text-[hsl(var(--muted-foreground))]" />
        </div>
        <p className="text-base font-semibold text-white mb-1">No photos in this event</p>
        <p className="text-sm text-[hsl(var(--muted-foreground))]">Your face was not matched in any photos from this event yet.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-[hsl(var(--muted-foreground))]">
          <span className="font-bold text-white tabular-nums">{photos.length}</span> photos matched
        </p>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 text-xs text-[hsl(var(--muted-foreground))] hover:text-white bg-[hsl(var(--muted))] border border-[hsl(var(--border))] px-3 py-1.5 rounded-lg transition-all">
            <Icon name="ArrowDownTrayIcon" size={13} />
            Download All
          </button>
        </div>
      </div>

      <div className="columns-2 md:columns-3 xl:columns-3 2xl:columns-4 gap-3 space-y-3">
        {photos.map((photo) => (
          <div
            key={photo.id}
            className="break-inside-avoid relative group rounded-xl overflow-hidden cursor-pointer photo-card-hover border border-[hsl(var(--border))] bg-[hsl(var(--muted))]"
            onClick={() => onPhotoClick(photo)}
          >
            <AppImage
              src={photo.src}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              className="w-full h-auto object-cover"
              loading="lazy"
            />

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-3">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-[10px] font-semibold text-white/80 truncate">{photo.eventName}</p>
                  <p className="text-[10px] text-white/60">{photo.photographer}</p>
                </div>
                <div className="flex gap-1.5">
                  <button
                    onClick={(e) => { e.stopPropagation(); }}
                    className="w-7 h-7 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all"
                    title="Download this photo"
                  >
                    <Icon name="ArrowDownTrayIcon" size={13} className="text-white" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); onPhotoClick(photo); }}
                    className="w-7 h-7 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all"
                    title="View full size"
                  >
                    <Icon name="ArrowsPointingOutIcon" size={13} className="text-white" />
                  </button>
                </div>
              </div>
            </div>

            {/* Confidence badge */}
            <div className="absolute top-2 left-2">
              <span className={`text-[10px] font-bold font-mono px-1.5 py-0.5 rounded-md border ${confidenceColor(photo.confidence)}`}>
                {photo.confidence.toFixed(1)}%
              </span>
            </div>

            {/* Match type */}
            <div className="absolute top-2 right-2">
              <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md ${
                photo.matchType === 'primary' ? 'bg-violet-500/30 text-violet-300' :
                photo.matchType === 'group'? 'bg-blue-500/30 text-blue-300' : 'bg-zinc-500/30 text-zinc-300'
              }`}>
                {matchTypeLabel[photo.matchType]}
              </span>
            </div>

            {photo.downloaded && (
              <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-[9px] font-bold text-green-400 bg-green-500/20 px-1.5 py-0.5 rounded flex items-center gap-1">
                  <Icon name="CheckIcon" size={9} />
                  Saved
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}