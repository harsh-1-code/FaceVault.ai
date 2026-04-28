'use client';
import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';

interface RegisterFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  eventCode: string;
  terms: boolean;
}

interface RegisterFormProps {
  onSuccess: () => void;
}

export default function RegisterForm({ onSuccess }: RegisterFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [faceCapturing, setFaceCapturing] = useState(false);
  const [faceCaptured, setFaceCaptured] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>();

  const password = watch('password');

  const startCamera = async () => {
    setCameraError('');
    setFaceCapturing(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch {
      setCameraError('Camera access denied. You can skip this step and add your face later.');
      setFaceCapturing(false);
    }
  };

  const captureFrame = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
    }
    setFaceCaptured(true);
    setFaceCapturing(false);
    toast.success('Face enrolled successfully!');
  };

  const retakePhoto = () => {
    setFaceCaptured(false);
    setFaceCapturing(false);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
    }
  };

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    // Backend integration point: POST /api/auth/register
    await new Promise((r) => setTimeout(r, 1400));
    toast.success('Account created! Please sign in.');
    setIsLoading(false);
    onSuccess();
    router.push('/user-photo-dashboard');
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-white">Create your account</h2>
        <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">Register once. Your photos find you forever.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-semibold text-[hsl(var(--foreground))] mb-1.5">Full Name</label>
          <input
            type="text"
            placeholder="Riya Sharma"
            className={`w-full bg-[hsl(var(--muted))] border rounded-lg px-4 py-3 text-sm text-white placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all ${errors.fullName ? 'border-red-500' : 'border-[hsl(var(--border))]'}`}
            {...register('fullName', { required: 'Full name is required', minLength: { value: 2, message: 'Name must be at least 2 characters' } })}
          />
          {errors.fullName && <p className="text-red-400 text-xs mt-1.5">{errors.fullName.message}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-semibold text-[hsl(var(--foreground))] mb-1.5">Email address</label>
          <input
            type="email"
            placeholder="you@example.com"
            className={`w-full bg-[hsl(var(--muted))] border rounded-lg px-4 py-3 text-sm text-white placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all ${errors.email ? 'border-red-500' : 'border-[hsl(var(--border))]'}`}
            {...register('email', {
              required: 'Email is required',
              pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' },
            })}
          />
          {errors.email && <p className="text-red-400 text-xs mt-1.5">{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-semibold text-[hsl(var(--foreground))] mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className={`w-full bg-[hsl(var(--muted))] border rounded-lg px-4 py-3 pr-10 text-sm text-white placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all ${errors.password ? 'border-red-500' : 'border-[hsl(var(--border))]'}`}
                {...register('password', {
                  required: 'Required',
                  minLength: { value: 8, message: 'Min 8 characters' },
                })}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))] hover:text-white">
                <Icon name={showPassword ? 'EyeSlashIcon' : 'EyeIcon'} size={16} />
              </button>
            </div>
            {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-[hsl(var(--foreground))] mb-1.5">Confirm</label>
            <input
              type="password"
              placeholder="••••••••"
              className={`w-full bg-[hsl(var(--muted))] border rounded-lg px-4 py-3 text-sm text-white placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all ${errors.confirmPassword ? 'border-red-500' : 'border-[hsl(var(--border))]'}`}
              {...register('confirmPassword', {
                required: 'Required',
                validate: (v) => v === password || 'Passwords do not match',
              })}
            />
            {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword.message}</p>}
          </div>
        </div>

        {/* Event Code */}
        <div>
          <label className="block text-sm font-semibold text-[hsl(var(--foreground))] mb-1.5">
            Event Code <span className="text-[hsl(var(--muted-foreground))] font-normal">(optional)</span>
          </label>
          <p className="text-xs text-[hsl(var(--muted-foreground))] mb-1.5">Enter the code shared by your event organizer to link your account to the event.</p>
          <input
            type="text"
            placeholder="e.g. WEDDING-2026-KL"
            className="w-full bg-[hsl(var(--muted))] border border-[hsl(var(--border))] rounded-lg px-4 py-3 text-sm text-white font-mono placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all uppercase"
            {...register('eventCode')}
          />
        </div>

        {/* Face Enrollment */}
        <div className="border border-dashed border-violet-500/40 rounded-xl p-4 bg-violet-500/5">
          <p className="text-sm font-semibold text-white mb-1 flex items-center gap-2">
            <Icon name="CameraIcon" size={16} className="text-violet-400" />
            Face Enrollment
            <span className="text-[10px] font-normal text-[hsl(var(--muted-foreground))]">(Recommended)</span>
          </p>
          <p className="text-xs text-[hsl(var(--muted-foreground))] mb-3">Capture your selfie once. FaceTrace will use it to find all your photos automatically.</p>

          {!faceCapturing && !faceCaptured && (
            <button
              type="button"
              onClick={startCamera}
              className="flex items-center gap-2 text-sm font-semibold text-violet-300 bg-violet-600/20 hover:bg-violet-600/30 border border-violet-500/30 px-4 py-2 rounded-lg transition-all"
            >
              <Icon name="CameraIcon" size={15} />
              Capture Selfie
            </button>
          )}

          {faceCapturing && (
            <div className="space-y-3">
              <div className="relative rounded-lg overflow-hidden bg-black aspect-video max-h-40 scan-line">
                <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
                <div className="absolute inset-0 border-2 border-cyan-500/30 rounded-lg pointer-events-none" />
                {/* Corner brackets */}
                <div className="absolute top-2 left-2 w-5 h-5 border-t-2 border-l-2 border-cyan-400/70" />
                <div className="absolute top-2 right-2 w-5 h-5 border-t-2 border-r-2 border-cyan-400/70" />
                <div className="absolute bottom-2 left-2 w-5 h-5 border-b-2 border-l-2 border-cyan-400/70" />
                <div className="absolute bottom-2 right-2 w-5 h-5 border-b-2 border-r-2 border-cyan-400/70" />
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={captureFrame} className="flex-1 bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold py-2 rounded-lg transition-all flex items-center justify-center gap-2">
                  <Icon name="CameraIcon" size={15} />
                  Capture
                </button>
                <button type="button" onClick={() => { setFaceCapturing(false); streamRef.current?.getTracks().forEach(t => t.stop()); }} className="px-4 py-2 text-sm text-[hsl(var(--muted-foreground))] bg-[hsl(var(--muted))] rounded-lg hover:text-white transition-all">
                  Skip
                </button>
              </div>
            </div>
          )}

          {faceCaptured && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                <Icon name="CheckIcon" size={18} className="text-green-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-green-400">Face enrolled successfully</p>
                <p className="text-xs text-[hsl(var(--muted-foreground))]">FaceTrace will use this to find your photos</p>
              </div>
              <button type="button" onClick={retakePhoto} className="ml-auto text-xs text-[hsl(var(--muted-foreground))] hover:text-white underline">Retake</button>
            </div>
          )}

          {cameraError && <p className="text-amber-400 text-xs mt-2 flex items-center gap-1"><Icon name="ExclamationTriangleIcon" size={12} />{cameraError}</p>}
        </div>

        {/* Terms */}
        <div>
          <label className="flex items-start gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 mt-0.5 rounded border-[hsl(var(--border))] bg-[hsl(var(--muted))] accent-violet-500 shrink-0"
              {...register('terms', { required: 'You must accept the terms to continue' })}
            />
            <span className="text-xs text-[hsl(var(--muted-foreground))] leading-relaxed">
              I agree to the{' '}
              <button type="button" className="text-violet-400 hover:text-violet-300 underline">Terms of Service</button>
              {' '}and{' '}
              <button type="button" className="text-violet-400 hover:text-violet-300 underline">Privacy Policy</button>
              . My face data will only be used to retrieve my personal photos.
            </span>
          </label>
          {errors.terms && <p className="text-red-400 text-xs mt-1.5">{errors.terms.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-all duration-150 active:scale-[0.98] flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Icon name="ArrowPathIcon" size={16} className="animate-spin" />
              <span>Creating account…</span>
            </>
          ) : (
            'Create Account'
          )}
        </button>
      </form>
    </div>
  );
}