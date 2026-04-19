"use client";

import React, { useState } from 'react';
import { LandingPageRenderer, LandingPageData } from '@/components/landing-page/Renderer';
import { Loader2, Sparkles, ArrowLeft, Save, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export default function GeneratePage() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<LandingPageData | null>(null);
  const [formData, setFormData] = useState({
    businessName: '',
    industry: '',
    targetAudience: '',
    goal: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const generatePage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error('Failed to generate');
      const generatedData = await res.json();
      setData(generatedData);
      toast.success('Magic happened! Page generated.');
    } catch (err) {
      toast.error('The AI is tired. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const savePage = async () => {
    if (!data) return;
    try {
      const res = await fetch('/api/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formData.businessName || 'Untitled', content: data }),
      });
      if (!res.ok) throw new Error('Failed to save');
      toast.success('Saved to your dashboard!');
    } catch (err) {
      toast.error('Please login to save.');
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] selection:bg-indigo-100">
      <AnimatePresence mode="wait">
        {data ? (
          /* PREVIEW MODE */
          <motion.div
            key="preview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b border-indigo-50 px-6 py-3 flex justify-between items-center shadow-sm">
              <button
                onClick={() => setData(null)}
                className="group flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-indigo-600 transition-all"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Editor
              </button>

              <div className="flex gap-3">
                <button
                  onClick={() => generatePage()}
                  disabled={loading}
                  className="px-5 py-2 text-sm font-semibold text-indigo-600 bg-indigo-50 rounded-full hover:bg-indigo-100 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  Regenerate
                </button>
                <button
                  onClick={savePage}
                  className="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-full hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 transition-all flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save Draft
                </button>
              </div>
            </div>
            <LandingPageRenderer data={data} />
          </motion.div>
        ) : (
          /* FORM MODE */
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative flex items-center justify-center py-20 px-4 overflow-hidden"
          >
            {/* Animated Background Orbs */}
            <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
            <div className="absolute top-0 -right-4 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000" />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative w-full max-w-xl bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/20 p-10"
            >
              <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center p-3 bg-indigo-600 rounded-2xl mb-4 shadow-lg shadow-indigo-200">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">AI Page Generator</h2>
                <p className="mt-3 text-slate-500">Transform your idea into a landing page in seconds.</p>
              </div>

              <form onSubmit={generatePage} className="space-y-5">
                {[
                  { label: 'Business Name', name: 'businessName', type: 'text', placeholder: 'e.g. Nexus AI' },
                  { label: 'Industry', name: 'industry', type: 'text', placeholder: 'e.g. Fintech, Wellness' },
                  { label: 'Target Audience', name: 'targetAudience', type: 'text', placeholder: 'e.g. Remote Marketers' },
                ].map((field) => (
                  <div key={field.name} className="group">
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1 transition-colors group-focus-within:text-indigo-600">
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      name={field.name}
                      required
                      value={formData[field.name as keyof typeof formData]}
                      onChange={handleChange}
                      className="w-full rounded-2xl border-slate-200 bg-slate-50/50 px-4 py-3 text-slate-900 transition-all focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none"
                      placeholder={field.placeholder}
                    />
                  </div>
                ))}

                <div className="group">
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1 group-focus-within:text-indigo-600">
                    The Goal
                  </label>
                  <textarea
                    name="goal"
                    required
                    rows={3}
                    value={formData.goal}
                    onChange={handleChange}
                    className="w-full rounded-2xl border-slate-200 bg-slate-50/50 px-4 py-3 text-slate-900 transition-all focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none resize-none"
                    placeholder="e.g. Encourage visitors to book a free consultation..."
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full relative group flex justify-center py-4 px-4 border border-transparent rounded-2xl shadow-xl shadow-indigo-100 text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none disabled:opacity-70 transition-all overflow-hidden"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Manifesting Design...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Generate Landing Page
                      <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </span>
                  )}
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
