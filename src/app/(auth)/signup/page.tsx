"use client";

import React, { useState } from 'react';
import { signUp } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Loader2, UserPlus, User, Mail, Lock, Sparkles, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await signUp.email({ name, email, password });
      if (res.error) {
        toast.error(res.error.message || 'Signup failed');
      } else {
        toast.success('Account created successfully!');
        router.push('/dashboard');
      }
    } catch (err) {
      toast.error('An error occurred during signup');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-6 py-12 overflow-hidden bg-[#0f172a]">
      {/* 3D Ambient Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[45%] h-[45%] bg-pink-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[5%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/25 rounded-full blur-[100px] animate-bounce" style={{ animationDuration: '10s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://vercel.app')] opacity-20 brightness-100 contrast-150 pointer-events-none"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", damping: 20, stiffness: 100 }}
        className="relative w-full max-w-[460px]"
      >
        {/* Glow Layer */}
        <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 via-indigo-500 to-purple-600 rounded-[2.5rem] blur-xl opacity-20 group-hover:opacity-40 transition duration-1000"></div>

        <div className="relative bg-slate-900/80 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] p-10 sm:p-12">
          <div className="text-center mb-10">
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-tr from-pink-500 to-indigo-600 rounded-2xl mb-6 shadow-[0_0_30px_rgba(236,72,153,0.3)]"
            >
              <UserPlus className="w-8 h-8 text-white" />
            </motion.div>
            <h2 className="text-4xl font-bold text-white tracking-tight mb-2">Join the Future</h2>
            <p className="text-slate-400 font-medium">Create your AI-powered workspace</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Name Input */}
            <div className="relative group/input">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within/input:text-pink-400 transition-colors z-10" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                className="block w-full rounded-2xl border border-white/5 bg-white/5 pl-12 pr-4 py-4 text-white placeholder:text-slate-500 transition-all focus:bg-white/10 focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/20 outline-none"
              />
            </div>

            {/* Email Input */}
            <div className="relative group/input">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within/input:text-indigo-400 transition-colors z-10" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="block w-full rounded-2xl border border-white/5 bg-white/5 pl-12 pr-4 py-4 text-white placeholder:text-slate-500 transition-all focus:bg-white/10 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 outline-none"
              />
            </div>

            {/* Password Input */}
            <div className="relative group/input">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within/input:text-purple-400 transition-colors z-10" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create Password"
                className="block w-full rounded-2xl border border-white/5 bg-white/5 pl-12 pr-4 py-4 text-white placeholder:text-slate-500 transition-all focus:bg-white/10 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 outline-none"
              />
            </div>

            <motion.button
              whileHover={{ y: -2, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3)" }}
              whileTap={{ y: 0, scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="relative w-full overflow-hidden group py-4 px-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold transition-all disabled:opacity-50"
            >
              <div className="relative z-10 flex justify-center items-center gap-2">
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <span>Get Started</span>
                    <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                  </>
                )}
              </div>
              {/* 3D Inner Glow & Shine */}
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute inset-0 w-1/2 h-full bg-white/20 skew-x-[-25deg] -translate-x-full group-hover:animate-shine" />
            </motion.button>
          </form>

          <p className="mt-10 text-center text-sm text-slate-400 font-medium">
            Already have an account?{' '}
            <Link href="/login" className="text-white hover:text-indigo-400 font-bold transition-all underline-offset-4 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
