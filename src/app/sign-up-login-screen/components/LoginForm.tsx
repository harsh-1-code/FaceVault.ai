'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';

interface LoginFormData {
  email: string;
  password: string;
  remember: boolean;
}

const demoCredentials = [
  { key: 'cred-user', role: 'Attendee', email: 'riya@facetrace.ai', password: 'FaceTrace@2026', href: '/user-photo-dashboard' },
  { key: 'cred-admin', role: 'Admin', email: 'admin@facetrace.ai', password: 'AdminTrace@2026', href: '/admin-panel' },
];

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm<LoginFormData>({ defaultValues: { remember: false } });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    // Backend integration point: POST /api/auth/login
    await new Promise((r) => setTimeout(r, 1200));

    const match = demoCredentials.find(
      (c) => c.email === data.email && c.password === data.password
    );

    if (!match) {
      setError('email', { message: 'Invalid credentials — use the demo accounts below to sign in' });
      setIsLoading(false);
      return;
    }

    toast.success(`Welcome back! Redirecting to ${match.role} dashboard…`);
    setTimeout(() => router.push(match.href), 800);
    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Sign in to FaceVault</h2>
        <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">Your face is waiting to be found.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-[hsl(var(--foreground))] mb-1.5">
            Email address
          </label>
          <input
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className={`w-full bg-[hsl(var(--muted))] border rounded-lg px-4 py-3 text-sm text-white placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all ${
              errors.email ? 'border-red-500' : 'border-[hsl(var(--border))]'
            }`}
            {...register('email', {
              required: 'Email is required',
              pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' },
            })}
          />
          {errors.email && (
            <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
              <Icon name="ExclamationCircleIcon" size={12} />
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-[hsl(var(--foreground))] mb-1.5">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="••••••••"
              className={`w-full bg-[hsl(var(--muted))] border rounded-lg px-4 py-3 pr-11 text-sm text-white placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all ${
                errors.password ? 'border-red-500' : 'border-[hsl(var(--border))]'
              }`}
              {...register('password', { required: 'Password is required' })}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))] hover:text-white transition-colors"
            >
              <Icon name={showPassword ? 'EyeSlashIcon' : 'EyeIcon'} size={18} />
            </button>
          </div>
          {errors.password && (
            <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
              <Icon name="ExclamationCircleIcon" size={12} />
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-[hsl(var(--border))] bg-[hsl(var(--muted))] accent-violet-500"
              {...register('remember')}
            />
            <span className="text-sm text-[hsl(var(--muted-foreground))]">Remember me</span>
          </label>
          <button type="button" className="text-sm text-violet-400 hover:text-violet-300 transition-colors">
            Forgot password?
          </button>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-all duration-150 active:scale-[0.98] flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Icon name="ArrowPathIcon" size={16} className="animate-spin" />
              <span>Verifying…</span>
            </>
          ) : (
            'Sign In'
          )}
        </button>
      </form>

      {/* Demo credentials */}
      <DemoCredentials
        credentials={demoCredentials}
        onUse={(email, password) => {
          setValue('email', email);
          setValue('password', password);
        }}
      />
    </div>
  );
}

function DemoCredentials({
  credentials,
  onUse,
}: {
  credentials: typeof demoCredentials;
  onUse: (email: string, password: string) => void;
}) {
  return (
    <div className="border border-[hsl(var(--border))] rounded-xl p-4 bg-[hsl(var(--muted))/30]">
      <p className="text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider mb-3 flex items-center gap-1.5">
        <Icon name="InformationCircleIcon" size={13} />
        Demo Accounts
      </p>
      <div className="space-y-2">
        {credentials.map((cred) => (
          <div
            key={cred.key}
            className="flex items-center justify-between bg-[hsl(var(--background))] rounded-lg px-3 py-2.5 gap-3"
          >
            <div className="min-w-0 flex-1">
              <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-violet-400 bg-violet-500/10 px-1.5 py-0.5 rounded mb-1">
                {cred.role}
              </span>
              <p className="text-xs font-mono text-[hsl(var(--foreground))] truncate">{cred.email}</p>
              <p className="text-xs font-mono text-[hsl(var(--muted-foreground))] truncate">{cred.password}</p>
            </div>
            <button
              type="button"
              onClick={() => onUse(cred.email, cred.password)}
              className="shrink-0 text-xs font-semibold text-cyan-400 hover:text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 px-3 py-1.5 rounded-lg transition-all"
            >
              Use
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
