'use client';
import React, { useEffect } from 'react';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';
import { type Photo } from '../data/mockData';
import { toast } from 'sonner';

interface PhotoLightboxProps {
  photo: Photo;
  onClose: () => void;
  allPhotos: Photo[];
  onNavigate: (photo: Photo) => void;
}

export default function PhotoLightbox({ photo, onClose, allPhotos, onNavigate }: PhotoLightboxProps) {
  const currentIndex = allPhotos.findIndex((p) => p.id === photo.id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < allPhotos.length - 1;

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && hasPrev) onNavigate(allPhotos[currentIndex - 1]);
      if (e.key === 'ArrowRight' && hasNext) onNavigate(allPhotos[currentIndex + 1]);
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose, hasPrev, hasNext, allPhotos, currentIndex, onNavigate]);

  const handleDownload = () => {
    // Backend integration point: GET /api/photos/:id/download
    toast.success('Download started — check your downloads folder.');
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative max-w-5xl w-full max-h-[90vh] bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl overflow-hidden flex flex-col lg:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image area */}
        <div className="flex-1 relative bg-black flex items-center justify-center min-h-[300px] lg:min-h-[500px]">
          <AppImage
            src={photo.src}
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
            className="max-h-[60vh] lg:max-h-[80vh] w-auto h-auto object-contain"
            priority
          />

          {/* Nav arrows */}
          {hasPrev && (
            <button
              onClick={() => onNavigate(allPhotos[currentIndex - 1])}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 border border-white/10 flex items-center justify-center text-white transition-all"
            >
              <Icon name="ChevronLeftIcon" size={20} />
            </button>
          )}
          {hasNext && (
            <button
              onClick={() => onNavigate(allPhotos[currentIndex + 1])}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 border border-white/10 flex items-center justify-center text-white transition-all"
            >
              <Icon name="ChevronRightIcon" size={20} />
            </button>
          )}

          {/* Counter */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs font-mono px-3 py-1 rounded-full">
            {currentIndex + 1} / {allPhotos.length}
          </div>
        </div>

        {/* Info panel */}
        <div className="lg:w-72 border-t lg:border-t-0 lg:border-l border-[hsl(var(--border))] p-5 flex flex-col gap-4">
          {/* Close */}
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Photo Details</h3>
            <button onClick={onClose} className="w-7 h-7 rounded-lg bg-[hsl(var(--muted))] hover:bg-[hsl(var(--muted))]/80 flex items-center justify-center text-[hsl(var(--muted-foreground))] hover:text-white transition-all">
              <Icon name="XMarkIcon" size={15} />
            </button>
          </div>

          {/* Confidence */}
          <div className="bg-[hsl(var(--muted))] rounded-xl p-4 text-center">
            <p className="text-3xl font-bold tabular-nums font-mono text-white">{photo.confidence.toFixed(1)}%</p>
            <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">Match Confidence</p>
            <div className="mt-3 h-1.5 bg-[hsl(var(--background))] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-500"
                style={{ width: `${photo.confidence}%` }}
              />
            </div>
          </div>

          {/* Metadata */}
          <div className="space-y-3">
            {[
              { key: 'meta-event', icon: 'CalendarIcon', label: 'Event', value: photo.eventName },
              { key: 'meta-photo', icon: 'CameraIcon', label: 'Photographer', value: photo.photographer },
              { key: 'meta-time', icon: 'ClockIcon', label: 'Captured', value: formatDate(photo.capturedAt) },
              { key: 'meta-match', icon: 'SparklesIcon', label: 'Match Type', value: photo.matchType.charAt(0).toUpperCase() + photo.matchType.slice(1) },
            ].map((item) => (
              <div key={item.key} className="flex items-start gap-2.5">
                <Icon name={item.icon as Parameters<typeof Icon>[0]['name']} size={14} className="text-[hsl(var(--muted-foreground))] shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">{item.label}</p>
                  <p className="text-xs text-white truncate">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="mt-auto space-y-2">
            <button
              onClick={handleDownload}
              className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 active:scale-[0.98] text-white text-sm font-semibold py-2.5 rounded-xl transition-all"
            >
              <Icon name="ArrowDownTrayIcon" size={16} />
              Download Photo
            </button>
            <button className="w-full flex items-center justify-center gap-2 bg-[hsl(var(--muted))] hover:bg-[hsl(var(--muted))]/80 border border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:text-white text-sm font-semibold py-2.5 rounded-xl transition-all">
              <Icon name="ShareIcon" size={16} />
              Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}