'use client';
import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import Icon from '@/components/ui/AppIcon';

interface UploadModalProps {
  onClose: () => void;
}

interface UploadFormData {
  eventName: string;
  eventType: string;
  eventDate: string;
  location: string;
  organizerName: string;
  eventCode: string;
  maxAttendees: string;
  notes: string;
}

interface UploadedFile {
  id: string;
  name: string;
  sizeMb: number;
  status: 'pending' | 'uploading' | 'done' | 'error';
  progress: number;
}

export default function UploadModal({ onClose }: UploadModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<UploadFormData>();

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith('image/'));
    addFiles(files);
  };

  const addFiles = (files: File[]) => {
    const newFiles: UploadedFile[] = files.map((f, i) => ({
      id: `file-${Date.now()}-${i}`,
      name: f.name,
      sizeMb: parseFloat((f.size / 1024 / 1024).toFixed(2)),
      status: 'pending',
      progress: 0,
    }));
    setUploadedFiles((prev) => [...prev, ...newFiles]);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    addFiles(files);
  };

  const removeFile = (id: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const simulateUpload = () => {
    // Backend integration point: POST /api/admin/events/:id/photos (multipart)
    setUploadedFiles((prev) =>
      prev.map((f) => ({ ...f, status: 'uploading' as const, progress: 0 }))
    );

    let tick = 0;
    const interval = setInterval(() => {
      tick += 1;
      setUploadedFiles((prev) =>
        prev.map((f) => {
          const newProgress = Math.min(f.progress + Math.floor(10 + tick * 2), 100);
          return {
            ...f,
            progress: newProgress,
            status: newProgress === 100 ? 'done' : 'uploading',
          };
        })
      );
      const allDone = uploadedFiles.every((f) => f.progress >= 100);
      if (allDone || tick > 15) {
        clearInterval(interval);
        setUploadedFiles((prev) => prev.map((f) => ({ ...f, status: 'done', progress: 100 })));
      }
    }, 200);
  };

  const onSubmitStep1 = () => setStep(2);

  const onSubmitStep2 = () => {
    if (uploadedFiles.length === 0) {
      toast.error('Add at least one photo before proceeding.');
      return;
    }
    setStep(3);
  };

  const onFinalSubmit = async () => {
    setIsSubmitting(true);
    simulateUpload();
    // Backend integration point: POST /api/admin/events (create event + trigger encoding pipeline)
    await new Promise((r) => setTimeout(r, 3000));
    setIsSubmitting(false);
    toast.success(`Event "${getValues('eventName')}" created — ${uploadedFiles.length} photos queued for encoding.`);
    onClose();
  };

  const stepLabels = ['Event Details', 'Upload Photos', 'Review & Submit'];
  const totalSizeMb = uploadedFiles.reduce((s, f) => s + f.sizeMb, 0);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[hsl(var(--border))]">
          <div>
            <h2 className="text-base font-bold text-white">Upload Event Photos</h2>
            <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5">Create an event and trigger face encoding pipeline</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[hsl(var(--muted))] hover:bg-[hsl(var(--muted))]/80 flex items-center justify-center text-[hsl(var(--muted-foreground))] hover:text-white transition-all"
          >
            <Icon name="XMarkIcon" size={16} />
          </button>
        </div>

        {/* Step indicator */}
        <div className="flex items-center px-6 py-4 gap-0">
          {stepLabels.map((label, idx) => {
            const stepNum = (idx + 1) as 1 | 2 | 3;
            const isActive = step === stepNum;
            const isDone = step > stepNum;
            return (
              <React.Fragment key={`step-${stepNum}`}>
                <div className="flex flex-col items-center gap-1">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isDone ? 'bg-green-500 text-white' : isActive ?'bg-violet-600 text-white': 'bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]'
                  }`}>
                    {isDone ? <Icon name="CheckIcon" size={13} /> : stepNum}
                  </div>
                  <span className={`text-[10px] font-semibold whitespace-nowrap ${isActive ? 'text-violet-400' : isDone ? 'text-green-400' : 'text-[hsl(var(--muted-foreground))]'}`}>
                    {label}
                  </span>
                </div>
                {idx < stepLabels.length - 1 && (
                  <div className={`flex-1 h-px mx-2 mb-4 transition-all ${step > stepNum ? 'bg-green-500/50' : 'bg-[hsl(var(--border))]'}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Modal body */}
        <div className="flex-1 overflow-y-auto scrollbar-thin px-6 pb-6">

          {/* Step 1: Event Details */}
          {step === 1 && (
            <form onSubmit={handleSubmit(onSubmitStep1)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-[hsl(var(--foreground))] mb-1.5">Event Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Ananya & Rohan Wedding Reception"
                    className={`w-full bg-[hsl(var(--muted))] border rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all ${errors.eventName ? 'border-red-500' : 'border-[hsl(var(--border))]'}`}
                    {...register('eventName', { required: 'Event name is required' })}
                  />
                  {errors.eventName && <p className="text-red-400 text-xs mt-1">{errors.eventName.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[hsl(var(--foreground))] mb-1.5">Event Type</label>
                  <select
                    className={`w-full bg-[hsl(var(--muted))] border rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all ${errors.eventType ? 'border-red-500' : 'border-[hsl(var(--border))]'}`}
                    {...register('eventType', { required: 'Select event type' })}
                  >
                    <option value="">Select type…</option>
                    <option value="wedding">Wedding</option>
                    <option value="corporate">Corporate Event</option>
                    <option value="college">College Fest</option>
                    <option value="conference">Conference</option>
                    <option value="alumni">Alumni Meet</option>
                  </select>
                  {errors.eventType && <p className="text-red-400 text-xs mt-1">{errors.eventType.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[hsl(var(--foreground))] mb-1.5">Event Date</label>
                  <input
                    type="date"
                    className={`w-full bg-[hsl(var(--muted))] border rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all ${errors.eventDate ? 'border-red-500' : 'border-[hsl(var(--border))]'}`}
                    {...register('eventDate', { required: 'Event date is required' })}
                  />
                  {errors.eventDate && <p className="text-red-400 text-xs mt-1">{errors.eventDate.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[hsl(var(--foreground))] mb-1.5">Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Udaipur, Rajasthan"
                    className={`w-full bg-[hsl(var(--muted))] border rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all ${errors.location ? 'border-red-500' : 'border-[hsl(var(--border))]'}`}
                    {...register('location', { required: 'Location is required' })}
                  />
                  {errors.location && <p className="text-red-400 text-xs mt-1">{errors.location.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[hsl(var(--foreground))] mb-1.5">Organizer / Photographer Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Kiran Mehta Photography"
                    className="w-full bg-[hsl(var(--muted))] border border-[hsl(var(--border))] rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
                    {...register('organizerName')}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[hsl(var(--foreground))] mb-1.5">Event Access Code</label>
                  <p className="text-xs text-[hsl(var(--muted-foreground))] mb-1.5">Share this code with attendees so they can link their account to this event.</p>
                  <input
                    type="text"
                    placeholder="e.g. WEDDING-2026-KL"
                    className="w-full bg-[hsl(var(--muted))] border border-[hsl(var(--border))] rounded-lg px-4 py-2.5 text-sm text-white font-mono uppercase placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
                    {...register('eventCode')}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[hsl(var(--foreground))] mb-1.5">Expected Attendees</label>
                  <input
                    type="number"
                    placeholder="e.g. 120"
                    min="1"
                    className="w-full bg-[hsl(var(--muted))] border border-[hsl(var(--border))] rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
                    {...register('maxAttendees')}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-[hsl(var(--foreground))] mb-1.5">Notes <span className="font-normal text-[hsl(var(--muted-foreground))]">(optional)</span></label>
                  <textarea
                    rows={2}
                    placeholder="Any special instructions for photo matching or delivery…"
                    className="w-full bg-[hsl(var(--muted))] border border-[hsl(var(--border))] rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all resize-none"
                    {...register('notes')}
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 active:scale-[0.98] text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-all"
                >
                  Continue to Photos
                  <Icon name="ArrowRightIcon" size={15} />
                </button>
              </div>
            </form>
          )}

          {/* Step 2: Upload Photos */}
          {step === 2 && (
            <div className="space-y-4">
              {/* Dropzone */}
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${
                  isDragging
                    ? 'border-violet-500 bg-violet-500/10'
                    : 'border-[hsl(var(--border))] hover:border-violet-500/50 hover:bg-violet-500/5'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileInput}
                />
                <div className="w-14 h-14 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mx-auto mb-4">
                  <Icon name="ArrowUpTrayIcon" size={26} className="text-violet-400" />
                </div>
                <p className="text-sm font-semibold text-white mb-1">
                  {isDragging ? 'Drop photos here' : 'Drag & drop event photos'}
                </p>
                <p className="text-xs text-[hsl(var(--muted-foreground))]">or click to browse — JPG, PNG, HEIC supported</p>
                <p className="text-[10px] text-[hsl(var(--muted-foreground))] mt-2">Max 50MB per file · Bulk upload supported</p>
              </div>

              {/* File list */}
              {uploadedFiles.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider">
                      {uploadedFiles.length} files · {totalSizeMb.toFixed(1)} MB total
                    </p>
                    <button
                      onClick={() => setUploadedFiles([])}
                      className="text-xs text-red-400 hover:text-red-300 transition-colors"
                    >
                      Remove all
                    </button>
                  </div>
                  <div className="max-h-48 overflow-y-auto scrollbar-thin space-y-1.5">
                    {uploadedFiles.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center gap-3 bg-[hsl(var(--muted))] rounded-xl px-3 py-2.5"
                      >
                        <div className="w-7 h-7 rounded-lg bg-violet-500/10 flex items-center justify-center shrink-0">
                          <Icon name="PhotoIcon" size={14} className="text-violet-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-white truncate">{file.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] text-[hsl(var(--muted-foreground))] font-mono">{file.sizeMb} MB</span>
                            {file.status === 'uploading' && (
                              <div className="flex-1 h-1 bg-[hsl(var(--background))] rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-violet-500 rounded-full transition-all duration-200"
                                  style={{ width: `${file.progress}%` }}
                                />
                              </div>
                            )}
                            {file.status === 'done' && (
                              <span className="text-[10px] text-green-400 font-semibold flex items-center gap-0.5">
                                <Icon name="CheckIcon" size={10} />
                                Uploaded
                              </span>
                            )}
                            {file.status === 'error' && (
                              <span className="text-[10px] text-red-400 font-semibold">Failed</span>
                            )}
                          </div>
                        </div>
                        {file.status === 'pending' && (
                          <button
                            onClick={() => removeFile(file.id)}
                            className="w-6 h-6 rounded-lg bg-[hsl(var(--background))] hover:bg-red-500/20 flex items-center justify-center text-[hsl(var(--muted-foreground))] hover:text-red-400 transition-all shrink-0"
                          >
                            <Icon name="XMarkIcon" size={12} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-between pt-2">
                <button
                  onClick={() => setStep(1)}
                  className="flex items-center gap-2 bg-[hsl(var(--muted))] hover:bg-[hsl(var(--muted))]/80 border border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all"
                >
                  <Icon name="ArrowLeftIcon" size={15} />
                  Back
                </button>
                <button
                  onClick={onSubmitStep2}
                  className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 active:scale-[0.98] text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-all"
                >
                  Review & Submit
                  <Icon name="ArrowRightIcon" size={15} />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div className="space-y-5">
              <div className="bg-[hsl(var(--muted))] rounded-2xl p-5 space-y-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Icon name="CalendarDaysIcon" size={15} className="text-violet-400" />
                  Event Summary
                </h4>
                {[
                  { key: 'rev-name', label: 'Name', value: getValues('eventName') || '—' },
                  { key: 'rev-type', label: 'Type', value: getValues('eventType') || '—' },
                  { key: 'rev-date', label: 'Date', value: getValues('eventDate') || '—' },
                  { key: 'rev-location', label: 'Location', value: getValues('location') || '—' },
                  { key: 'rev-organizer', label: 'Organizer', value: getValues('organizerName') || '—' },
                  { key: 'rev-code', label: 'Access Code', value: getValues('eventCode') || 'Auto-generated' },
                  { key: 'rev-attendees', label: 'Expected Attendees', value: getValues('maxAttendees') || '—' },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between text-sm">
                    <span className="text-[hsl(var(--muted-foreground))] font-medium">{item.label}</span>
                    <span className="text-white font-semibold">{item.value}</span>
                  </div>
                ))}
              </div>

              <div className="bg-[hsl(var(--muted))] rounded-2xl p-5">
                <h4 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
                  <Icon name="PhotoIcon" size={15} className="text-cyan-400" />
                  Photo Upload Summary
                </h4>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <p className="text-xl font-bold tabular-nums font-mono text-white">{uploadedFiles.length}</p>
                    <p className="text-[10px] text-[hsl(var(--muted-foreground))] uppercase tracking-wider">Photos</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold tabular-nums font-mono text-white">{totalSizeMb.toFixed(1)}</p>
                    <p className="text-[10px] text-[hsl(var(--muted-foreground))] uppercase tracking-wider">MB Total</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold tabular-nums font-mono text-cyan-400">~{Math.ceil(uploadedFiles.length * 0.8)}s</p>
                    <p className="text-[10px] text-[hsl(var(--muted-foreground))] uppercase tracking-wider">Est. Encode</p>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-violet-500/8 border border-violet-500/20 rounded-xl p-4">
                <Icon name="InformationCircleIcon" size={16} className="text-violet-400 shrink-0 mt-0.5" />
                <p className="text-xs text-[hsl(var(--muted-foreground))] leading-relaxed">
                  After submission, FaceTrace AI will detect and encode all faces in the uploaded photos. Attendees with registered face profiles will automatically receive their matched photos. Processing time depends on photo volume.
                </p>
              </div>

              <div className="flex justify-between pt-2">
                <button
                  onClick={() => setStep(2)}
                  className="flex items-center gap-2 bg-[hsl(var(--muted))] hover:bg-[hsl(var(--muted))]/80 border border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all"
                >
                  <Icon name="ArrowLeftIcon" size={15} />
                  Back
                </button>
                <button
                  onClick={onFinalSubmit}
                  disabled={isSubmitting}
                  className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 disabled:opacity-60 active:scale-[0.98] text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-all"
                >
                  {isSubmitting ? (
                    <><Icon name="ArrowPathIcon" size={15} className="animate-spin" />Processing…</>
                  ) : (
                    <><Icon name="RocketLaunchIcon" size={15} />Create Event & Start Encoding</>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}