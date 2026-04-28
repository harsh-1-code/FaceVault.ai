'use client';
import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import BrandPanel from './BrandPanel';

export default function AuthScreen() {
  const [tab, setTab] = useState<'login' | 'register'>('login');

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] flex">
      {/* Left brand panel */}
      <BrandPanel />

      {/* Right form panel */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 lg:px-16 min-h-screen">
        <div className="w-full max-w-md animate-fadeIn">
          {/* Tab switcher */}
          <div className="flex rounded-xl bg-[hsl(var(--muted))] p-1 mb-8">
            <button
              onClick={() => setTab('login')}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
                tab === 'login' ?'bg-violet-600 text-white shadow-lg' :'text-[hsl(var(--muted-foreground))] hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setTab('register')}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
                tab === 'register' ?'bg-violet-600 text-white shadow-lg' :'text-[hsl(var(--muted-foreground))] hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>

          {tab === 'login' ? <LoginForm /> : <RegisterForm onSuccess={() => setTab('login')} />}
        </div>
      </div>
    </div>
  );
}