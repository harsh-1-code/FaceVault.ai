'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AppLogo from '@/components/ui/AppLogo';
import Icon from '@/components/ui/AppIcon';

interface NavItem {
  key: string;
  label: string;
  icon: string;
  href: string;
  badge?: number;
}

const userNav: NavItem[] = [
  { key: 'nav-dashboard', label: 'My Photos', icon: 'PhotoIcon', href: '/user-photo-dashboard' },
  { key: 'nav-events', label: 'My Events', icon: 'CalendarIcon', href: '/user-photo-dashboard' },
  { key: 'nav-profile', label: 'Face Profile', icon: 'UserCircleIcon', href: '/user-photo-dashboard' },
  { key: 'nav-downloads', label: 'Downloads', icon: 'ArrowDownTrayIcon', href: '/user-photo-dashboard', badge: 3 },
];

const adminNav: NavItem[] = [
  { key: 'nav-admin-overview', label: 'Overview', icon: 'ChartBarIcon', href: '/admin-panel' },
  { key: 'nav-admin-events', label: 'Events', icon: 'CalendarDaysIcon', href: '/admin-panel' },
  { key: 'nav-admin-photos', label: 'Photo Library', icon: 'PhotoIcon', href: '/admin-panel' },
  { key: 'nav-admin-users', label: 'Registered Users', icon: 'UsersIcon', href: '/admin-panel', badge: 12 },
  { key: 'nav-admin-queue', label: 'Encoding Queue', icon: 'CpuChipIcon', href: '/admin-panel', badge: 5 },
  { key: 'nav-admin-analytics', label: 'Analytics', icon: 'PresentationChartLineIcon', href: '/admin-panel' },
  { key: 'nav-admin-settings', label: 'Settings', icon: 'Cog6ToothIcon', href: '/admin-panel' },
];

interface SidebarProps {
  role?: 'user' | 'admin';
}

export default function Sidebar({ role = 'user' }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const navItems = role === 'admin' ? adminNav : userNav;

  return (
    <aside
      className={`
        flex flex-col h-full bg-[hsl(240_10%_5%)] border-r border-[hsl(var(--border))]
        transition-all duration-300 ease-in-out shrink-0
        ${collapsed ? 'w-16' : 'w-60'}
      `}
    >
      {/* Logo */}
      <div className={`flex items-center h-16 px-3 border-b border-[hsl(var(--border))] ${collapsed ? 'justify-center' : 'gap-3'}`}>
        <AppLogo size={32} />
        {!collapsed && (
          <span className="font-bold text-[15px] tracking-tight text-white whitespace-nowrap">
            FaceTrace <span className="text-violet-400">AI</span>
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto scrollbar-thin">
        {!collapsed && (
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[hsl(var(--muted-foreground))] px-3 pb-2">
            {role === 'admin' ? 'Admin' : 'Personal'}
          </p>
        )}
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.key}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                transition-all duration-150 group relative
                ${isActive
                  ? 'bg-violet-600/20 text-violet-300 border border-violet-600/30'
                  : 'text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] hover:text-white'
                }
                ${collapsed ? 'justify-center' : ''}
              `}
            >
              <Icon name={item.icon as Parameters<typeof Icon>[0]['name']} size={18} className={isActive ? 'text-violet-400' : ''} />
              {!collapsed && (
                <>
                  <span className="flex-1 truncate">{item.label}</span>
                  {item.badge !== undefined && (
                    <span className="bg-violet-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full tabular-nums">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
              {collapsed && item.badge !== undefined && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-violet-500 rounded-full" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className={`border-t border-[hsl(var(--border))] p-2 space-y-1`}>
        {role === 'user' && (
          <Link
            href="/sign-up-login-screen"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] hover:text-white transition-all duration-150 ${collapsed ? 'justify-center' : ''}`}
            title={collapsed ? 'Switch to Admin' : undefined}
          >
            <Icon name="ShieldCheckIcon" size={18} />
            {!collapsed && <span>Admin Panel</span>}
          </Link>
        )}
        {role === 'admin' && (
          <Link
            href="/user-photo-dashboard"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] hover:text-white transition-all duration-150 ${collapsed ? 'justify-center' : ''}`}
            title={collapsed ? 'User View' : undefined}
          >
            <Icon name="UserIcon" size={18} />
            {!collapsed && <span>User View</span>}
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] hover:text-white transition-all duration-150 ${collapsed ? 'justify-center' : ''}`}
        >
          <Icon name={collapsed ? 'ChevronRightIcon' : 'ChevronLeftIcon'} size={18} />
          {!collapsed && <span>Collapse</span>}
        </button>

        {!collapsed && (
          <div className="px-3 py-2 mt-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                {role === 'admin' ? 'A' : 'R'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate">{role === 'admin' ? 'Admin User' : 'Riya Sharma'}</p>
                <p className="text-[10px] text-[hsl(var(--muted-foreground))] truncate">{role === 'admin' ? 'admin@facetrace.ai' : 'riya@example.com'}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}