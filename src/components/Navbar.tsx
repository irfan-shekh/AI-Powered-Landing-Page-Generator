"use client";

import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from '@/lib/auth-client';
import { Sparkles, LogOut, User, Loader2, LayoutDashboard } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success('Logged out successfully');
      router.push('/');
      router.refresh();
    } catch (error) {
      toast.error('Failed to log out');
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#0a0a0f]/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 group"
            aria-label="Home"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30 group-hover:shadow-indigo-500/50 transition-all">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white text-lg tracking-tight">
              PageAI
            </span>
          </Link>

          {/* Nav links */}
          <nav className="flex items-center gap-3">
            <Link
              href="/"
              className="px-4 py-1.5 text-sm font-semibold text-white hover:text-indigo-300 transition-colors"
            >
              Home
            </Link>

            <div className="flex items-center min-w-[100px] justify-end gap-3">
              {!mounted || isPending ? (
                /* Skeleton Loader: Matches the shape of the buttons to prevent jumping */
                <div className="h-8 w-24 animate-pulse rounded-full bg-white/10" />
              ) : session ? (
                <>
                  {/* Dashboard Button */}
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-1.5 px-4 py-1.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-full shadow-sm shadow-indigo-500/30 transition-all"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    <span className="hidden xs:inline">Dashboard</span>
                  </Link>

                  {/* User Avatar (Simplified for speed) */}
                  <div className="hidden md:flex items-center gap-2 bg-white/5 border border-white/10 rounded-full p-1 pr-3">
                    <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center">
                      <User className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-sm font-medium text-white max-w-[100px] truncate">
                      {session.user.name || 'User'}
                    </span>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    className="px-4 py-1.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-full transition-all"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}