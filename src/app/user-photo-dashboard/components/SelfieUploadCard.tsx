'use client';
import React, { useState, useRef } from 'react';
import Icon from '@/components/ui/AppIcon';
import { toast } from 'sonner';

interface SelfieUploadCardProps {
  onSearch: () => void;
  isSearching: boolean;
}

export default function SelfieUploadCard({ onSearch, isSearching }: SelfieUploadCardProps) {
  const [mode, setMode] = useState<'idle' | 'camera' | 'preview'>('idle');
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewSrc, setPreviewSrc] = useState('');

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      streamRef.current = stream;
      setMode('camera');
      setCameraActive(true);
      setTimeout(() => {
        if (videoRef.current) videoRef.current.srcObject = stream;
      }, 100);
    } catch {
      toast.error('Camera access denied. Try uploading a photo instead.');
    }
  };

  const captureFromCamera = () => {
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    setCameraActive(false);
    setPreviewSrc('https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&q=80');
    setMode('preview');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreviewSrc(url);
    setMode('preview');
  };

  const handleSearch = () => {
    onSearch();
    toast.success('Scanning event photos for your face…');
  };

  const reset = () => {
    setMode('idle');
    setPreviewSrc('');
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    setCameraActive(false);
  };

  return (
    <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl p-5 space-y-4 sticky top-20">
      <div>
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Icon name="MagnifyingGlassIcon" size={16} className="text-violet-400" />
          Find My Photos
        </h3>
        <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1 leading-relaxed">
          Capture or upload a selfie to scan all event photos and retrieve the ones with you.
        </p>
      </div>

      {/* Selfie area */}
      <div className="relative rounded-xl overflow-hidden bg-[hsl(var(--muted))] aspect-square border border-[hsl(var(--border))]">
        {mode === 'idle' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-4">
            {/* Face scan placeholder */}
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-violet-500/40 animate-pulse-slow" />
              <div className="absolute inset-3 rounded-full border border-cyan-500/30" />
              <div className="absolute inset-0 flex items-center justify-center">
                <svg viewBox="0 0 60 60" className="w-12 h-12" fill="none">
                  <ellipse cx="30" cy="28" rx="12" ry="14" stroke="#7C3AED" strokeWidth="1.2" opacity="0.7" />
                  <circle cx="25" cy="24" r="2" stroke="#06B6D4" strokeWidth="1" opacity="0.8" />
                  <circle cx="35" cy="24" r="2" stroke="#06B6D4" strokeWidth="1" opacity="0.8" />
                  <path d="M25 34 Q30 38 35 34" stroke="#7C3AED" strokeWidth="1" fill="none" opacity="0.7" />
                  <path d="M4 4 L4 10 M4 4 L10 4" stroke="#A78BFA" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
                  <path d="M56 4 L56 10 M56 4 L50 4" stroke="#A78BFA" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
                  <path d="M4 56 L4 50 M4 56 L10 56" stroke="#A78BFA" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
                  <path d="M56 56 L56 50 M56 56 L50 56" stroke="#A78BFA" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
                </svg>
              </div>
            </div>
            <p className="text-xs text-[hsl(var(--muted-foreground))] text-center">Position your face in the frame</p>
          </div>
        )}

        {mode === 'camera' && (
          <div className="absolute inset-0 scan-line">
            <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
            <div className="absolute top-2 left-2 w-5 h-5 border-t-2 border-l-2 border-cyan-400" />
            <div className="absolute top-2 right-2 w-5 h-5 border-t-2 border-r-2 border-cyan-400" />
            <div className="absolute bottom-2 left-2 w-5 h-5 border-b-2 border-l-2 border-cyan-400" />
            <div className="absolute bottom-2 right-2 w-5 h-5 border-b-2 border-r-2 border-cyan-400" />
          </div>
        )}

        {mode === 'preview' && previewSrc && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={previewSrc} alt="Captured selfie for face recognition search" className="w-full h-full object-cover" />
        )}

        {isSearching && (
          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center gap-3 scan-line">
            <div className="w-10 h-10 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
            <p className="text-xs text-violet-300 font-mono">Scanning faces…</p>
          </div>
        )}
      </div>

      {/* Actions */}
      {mode === 'idle' && (
        <div className="space-y-2">
          <button
            onClick={startCamera}
            className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 active:scale-[0.98] text-white text-sm font-semibold py-2.5 rounded-xl transition-all"
          >
            <Icon name="CameraIcon" size={16} />
            Open Camera
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center justify-center gap-2 bg-[hsl(var(--muted))] hover:bg-[hsl(var(--muted))]/80 active:scale-[0.98] text-white text-sm font-semibold py-2.5 rounded-xl transition-all border border-[hsl(var(--border))]"
          >
            <Icon name="ArrowUpTrayIcon" size={16} />
            Upload Selfie
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
        </div>
      )}

      {mode === 'camera' && (
        <div className="flex gap-2">
          <button onClick={captureFromCamera} className="flex-1 flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold py-2.5 rounded-xl transition-all active:scale-[0.98]">
            <Icon name="CameraIcon" size={16} />
            Capture
          </button>
          <button onClick={reset} className="px-4 bg-[hsl(var(--muted))] hover:bg-[hsl(var(--muted))]/80 text-[hsl(var(--muted-foreground))] hover:text-white text-sm py-2.5 rounded-xl transition-all border border-[hsl(var(--border))]">
            Cancel
          </button>
        </div>
      )}

      {mode === 'preview' && (
        <div className="space-y-2">
          <button
            onClick={handleSearch}
            disabled={isSearching}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 disabled:opacity-60 text-white text-sm font-semibold py-2.5 rounded-xl transition-all active:scale-[0.98] glow-violet"
          >
            {isSearching ? (
              <><Icon name="ArrowPathIcon" size={16} className="animate-spin" />Searching…</>
            ) : (
              <><Icon name="MagnifyingGlassIcon" size={16} />Search My Photos</>
            )}
          </button>
          <button onClick={reset} className="w-full text-xs text-[hsl(var(--muted-foreground))] hover:text-white transition-colors py-1">
            Retake / Upload different photo
          </button>
        </div>
      )}

      {/* Privacy note */}
      <div className="flex items-start gap-2 bg-[hsl(var(--muted))/40] rounded-lg p-3">
        <Icon name="LockClosedIcon" size={13} className="text-green-400 shrink-0 mt-0.5" />
        <p className="text-[10px] text-[hsl(var(--muted-foreground))] leading-relaxed">
          Your selfie is processed locally and never stored. Only face encoding vectors are used for matching.
        </p>
      </div>
    </div>
  );
}