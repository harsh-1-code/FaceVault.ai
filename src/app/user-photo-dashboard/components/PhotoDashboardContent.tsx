'use client';
import React, { useState } from 'react';
import DashboardTopbar from './DashboardTopbar';
import StatsStrip from './StatsStrip';
import SelfieUploadCard from './SelfieUploadCard';
import EventFilterTabs from './EventFilterTabs';
import PhotoGrid from './PhotoGrid';
import PhotoLightbox from './PhotoLightbox';
import { mockPhotos, mockEvents, type Photo } from '../data/mockData';

export default function PhotoDashboardContent() {
  const [selectedEvent, setSelectedEvent] = useState<string>('all');
  const [lightboxPhoto, setLightboxPhoto] = useState<Photo | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(true);

  const filteredPhotos = selectedEvent === 'all'
    ? mockPhotos
    : mockPhotos.filter((p) => p.eventId === selectedEvent);

  const handleSelfieSearch = () => {
    setIsSearching(true);
    // Backend integration point: POST /api/match/selfie
    setTimeout(() => {
      setIsSearching(false);
      setHasSearched(true);
    }, 2200);
  };

  return (
    <div className="flex flex-col min-h-full">
      <DashboardTopbar />

      <div className="flex-1 px-6 lg:px-8 xl:px-10 2xl:px-12 py-6 max-w-screen-2xl mx-auto w-full space-y-6">
        <StatsStrip photoCount={mockPhotos.length} eventCount={mockEvents.length} />

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Selfie upload sidebar card */}
          <div className="xl:col-span-1">
            <SelfieUploadCard onSearch={handleSelfieSearch} isSearching={isSearching} />
          </div>

          {/* Main content */}
          <div className="xl:col-span-3 space-y-5">
            <EventFilterTabs
              events={mockEvents}
              selected={selectedEvent}
              onSelect={setSelectedEvent}
              photoCounts={mockEvents.reduce((acc, e) => {
                acc[e.id] = mockPhotos.filter(p => p.eventId === e.id).length;
                return acc;
              }, {} as Record<string, number>)}
            />

            {hasSearched ? (
              <PhotoGrid
                photos={filteredPhotos}
                onPhotoClick={setLightboxPhoto}
              />
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-16 h-16 rounded-full bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-4">
                  <svg viewBox="0 0 40 40" className="w-8 h-8" fill="none">
                    <circle cx="20" cy="18" r="8" stroke="#7C3AED" strokeWidth="1.5" />
                    <circle cx="16" cy="16" r="2" stroke="#06B6D4" strokeWidth="1.2" />
                    <circle cx="24" cy="16" r="2" stroke="#06B6D4" strokeWidth="1.2" />
                    <path d="M15 22 Q20 26 25 22" stroke="#7C3AED" strokeWidth="1.2" fill="none" />
                  </svg>
                </div>
                <p className="text-base font-semibold text-white mb-1">No photos retrieved yet</p>
                <p className="text-sm text-[hsl(var(--muted-foreground))] max-w-xs">
                  Upload a selfie using the panel on the left to find all event photos you appear in.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {lightboxPhoto && (
        <PhotoLightbox
          photo={lightboxPhoto}
          onClose={() => setLightboxPhoto(null)}
          allPhotos={filteredPhotos}
          onNavigate={setLightboxPhoto}
        />
      )}
    </div>
  );
}