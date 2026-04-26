"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { LandingPageData } from "@/components/landing-page/Renderer";
import {
  Loader2,
  Plus,
  LayoutTemplate,
  ExternalLink,
  Sparkles,
  FolderOpen,
  X,
  Send,
  Trash2,
  Edit2,
} from "lucide-react";
import toast from "react-hot-toast";

interface SavedPage {
  id: string;
  name: string;
  content: LandingPageData;
  createdAt: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [pages, setPages] = useState<SavedPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Project name modal state
  const [showNameModal, setShowNameModal] = useState(false);
  const [projectName, setProjectName] = useState("");
  const nameInputRef = useRef<HTMLInputElement>(null);

  // Rename project modal state
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  const [editProjectName, setEditProjectName] = useState("");
  const renameInputRef = useRef<HTMLInputElement>(null);

  // Auto-focus modal input
  useEffect(() => {
    if (showNameModal) {
      setProjectName("");
      setTimeout(() => nameInputRef.current?.focus(), 80);
    }
  }, [showNameModal]);

  // Auto-focus rename modal input
  useEffect(() => {
    if (showRenameModal) {
      setTimeout(() => renameInputRef.current?.focus(), 80);
    }
  }, [showRenameModal]);

  const openModal = () => setShowNameModal(true);

  const openRenameModal = (id: string, currentName: string) => {
    setEditingPageId(id);
    setEditProjectName(currentName);
    setShowRenameModal(true);
  };

  const confirmAndNavigate = () => {
    const name = projectName.trim();
    if (!name) {
      nameInputRef.current?.focus();
      return;
    }
    setShowNameModal(false);
    router.push(`/generate?name=${encodeURIComponent(name)}`);
  };

  const handleRename = async () => {
    const name = editProjectName.trim();
    if (!name || !editingPageId) {
      renameInputRef.current?.focus();
      return;
    }

    try {
      const res = await fetch(`/api/pages/${editingPageId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (res.ok) {
        setPages((prev) =>
          prev.map((p) => (p.id === editingPageId ? { ...p, name } : p))
        );
        toast.success("Project renamed successfully");
        setShowRenameModal(false);
      } else {
        const error = await res.json();
        toast.error(error.error || "Failed to rename project");
      }
    } catch (error) {
      console.error("Rename failed", error);
      toast.error("An unexpected error occurred");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/pages/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setPages((prev) => prev.filter((p) => p.id !== id));
        toast.success("Project deleted successfully");
      } else {
        const error = await res.json();
        toast.error(error.error || "Failed to delete project");
      }
    } catch (error) {
      console.error("Delete failed", error);
      toast.error("An unexpected error occurred");
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const res = await fetch("/api/pages");
        if (res.ok) {
          const data = await res.json();
          setPages(data);
        }
      } catch (error) {
        console.error("Failed to fetch pages", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPages();
  }, []);

  // 🔥 3D Tilt Effect
  const handleMouseMove = (e: any) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rotateX = -(y - rect.height / 2) / 15;
    const rotateY = (x - rect.width / 2) / 15;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
  };

  const resetTilt = (e: any) => {
    e.currentTarget.style.transform =
      "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020617]">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#020617] py-12 px-6 overflow-hidden">

      {/* ─── PROJECT NAME MODAL ─────────────────────────────── */}
      <AnimatePresence>
        {showNameModal && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowNameModal(false)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal card */}
            <motion.div
              key="modal"
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: "spring", stiffness: 340, damping: 28 }}
              className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
            >
              <div
                className="pointer-events-auto w-full max-w-md mx-4 rounded-2xl
                  border border-white/15 bg-[#0d1526]/90 backdrop-blur-2xl
                  shadow-[0_30px_80px_rgba(0,0,0,0.7)]"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-indigo-500/15 border border-indigo-500/20">
                      <FolderOpen className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-white">Name Your Project</h2>
                      <p className="text-xs text-slate-400 mt-0.5">This will be used as the page title &amp; file name</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowNameModal(false)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Body */}
                <div className="px-6 py-5">
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Project Name
                  </label>
                  <input
                    ref={nameInputRef}
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") confirmAndNavigate();
                      if (e.key === "Escape") setShowNameModal(false);
                    }}
                    placeholder="e.g. SaaS Landing Page, Portfolio Site..."
                    maxLength={80}
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-3 text-sm
                      text-white placeholder:text-slate-600
                      focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-indigo-500/40
                      transition-all"
                  />
                  <p className="text-xs text-slate-600 mt-2 text-right">
                    {projectName.length}/80
                  </p>
                </div>

                {/* Footer */}
                <div className="px-6 pb-6 flex items-center gap-3 justify-end">
                  <button
                    onClick={() => setShowNameModal(false)}
                    className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white
                      bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-all"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={confirmAndNavigate}
                    disabled={!projectName.trim()}
                    className="flex items-center gap-2 px-5 py-2 text-sm font-bold
                      bg-gradient-to-r from-indigo-500 to-purple-500 text-white
                      rounded-lg shadow-lg shadow-indigo-500/25
                      disabled:opacity-40 disabled:cursor-not-allowed
                      hover:shadow-indigo-500/40 transition-all"
                  >
                    <Send className="w-4 h-4" />
                    Continue to Generate
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ─── RENAME PROJECT MODAL ─────────────────────────────── */}
      <AnimatePresence>
        {showRenameModal && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop-rename"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowRenameModal(false)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal card */}
            <motion.div
              key="modal-rename"
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: "spring", stiffness: 340, damping: 28 }}
              className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
            >
              <div
                className="pointer-events-auto w-full max-w-md mx-4 rounded-2xl
                  border border-white/15 bg-[#0d1526]/90 backdrop-blur-2xl
                  shadow-[0_30px_80px_rgba(0,0,0,0.7)]"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-indigo-500/15 border border-indigo-500/20">
                      <Edit2 className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-white">Rename Project</h2>
                      <p className="text-xs text-slate-400 mt-0.5">Update your project&apos;s name</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowRenameModal(false)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Body */}
                <div className="px-6 py-5">
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Project Name
                  </label>
                  <input
                    ref={renameInputRef}
                    type="text"
                    value={editProjectName}
                    onChange={(e) => setEditProjectName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleRename();
                      if (e.key === "Escape") setShowRenameModal(false);
                    }}
                    placeholder="Enter new name..."
                    maxLength={80}
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-3 text-sm
                      text-white placeholder:text-slate-600
                      focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-indigo-500/40
                      transition-all"
                  />
                  <p className="text-xs text-slate-600 mt-2 text-right">
                    {editProjectName.length}/80
                  </p>
                </div>

                {/* Footer */}
                <div className="px-6 pb-6 flex items-center gap-3 justify-end">
                  <button
                    onClick={() => setShowRenameModal(false)}
                    className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white
                      bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-all"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleRename}
                    disabled={!editProjectName.trim()}
                    className="flex items-center gap-2 px-5 py-2 text-sm font-bold
                      bg-gradient-to-r from-indigo-500 to-purple-500 text-white
                      rounded-lg shadow-lg shadow-indigo-500/25
                      disabled:opacity-40 disabled:cursor-not-allowed
                      hover:shadow-indigo-500/40 transition-all"
                  >
                    <Send className="w-4 h-4" />
                    Save Name
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      {/* 🌌 BACKGROUND */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.25),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(168,85,247,0.25),transparent_40%)] animate-pulse" />

        <div className="absolute top-[-100px] left-[20%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] animate-[spin_25s_linear_infinite]" />
        <div className="absolute bottom-[-100px] right-[10%] w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[100px] animate-[spin_30s_linear_infinite]" />

        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Your{" "}
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Landing Pages
              </span>
            </h1>
            <p className="mt-2 text-slate-400">
              Manage and view your generated masterpieces.
            </p>
          </div>

          <button
            onClick={openModal}
            className="relative inline-flex items-center gap-2 rounded-xl 
            bg-gradient-to-r from-indigo-500 to-purple-500 
            px-5 py-2.5 text-sm font-semibold text-white 
            shadow-lg hover:scale-105 transition-all duration-300
            before:absolute before:inset-0 before:rounded-xl 
            before:bg-gradient-to-r before:from-indigo-400 before:to-purple-400 
            before:blur-lg before:opacity-30"
          >
            <Plus className="w-4 h-4" />
            New Project
          </button>
        </div>

        {/* EMPTY STATE */}
        {pages.length === 0 ? (
          <div className="text-center rounded-2xl border border-white/10 bg-white/5 p-16 backdrop-blur-md">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-500/10 mb-6">
              <LayoutTemplate className="h-8 w-8 text-indigo-400" />
            </div>
            <h3 className="text-xl font-semibold text-white">
              No pages yet
            </h3>
            <p className="mt-2 text-slate-400 max-w-sm mx-auto">
              You haven't generated any landing pages. Start your journey with AI today.
            </p>
            <div className="mt-8">
              <button
                onClick={openModal}
                className="group inline-flex items-center gap-2 rounded-xl bg-white/10 border border-white/10 px-6 py-3 text-sm font-semibold text-white hover:bg-white/20 transition-all"
              >
                <Sparkles className="w-4 h-4 text-indigo-400 group-hover:rotate-12 transition-transform" />
                Create First Page
              </button>
            </div>
          </div>
        ) : (
          /* GRID */
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {pages.map((page, index) => (
              <motion.div
                key={page.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                onMouseMove={handleMouseMove}
                onMouseLeave={resetTilt}
                className="group relative rounded-2xl border border-white/10 
                bg-linear-to-br from-white/10 to-white/[0.02] 
                p-6 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.6)]
                hover:border-indigo-500/50 hover:shadow-indigo-500/30 
                transition-all duration-500"
              >
                {/* TOP */}
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 rounded-lg bg-indigo-500/10">
                    <LayoutTemplate className="h-5 w-5 text-indigo-400 group-hover:scale-125 group-hover:rotate-6 transition-all duration-300" />
                  </div>
                  <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500 bg-slate-500/10 px-2 py-1 rounded">
                    AI Generated
                  </span>
                </div>

                {/* TITLE */}
                <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors truncate">
                  {page.name}
                </h3>

                {/* DATE */}
                <p className="text-xs text-slate-500 mt-1 uppercase tracking-tighter">
                  {new Date(page.createdAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>

                {/* FOOTER */}
                <div className="mt-8 flex items-center justify-between">
                  <Link
                    href={`/preview/${page.id}`}
                    className="text-sm font-semibold text-slate-300 hover:text-white flex items-center gap-2 transition-colors"
                  >
                    View Page
                    <ExternalLink className="w-3.5 h-3.5 opacity-50" />
                  </Link>

                  <div className="h-px flex-1 mx-4 bg-white/5" />

                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        openRenameModal(page.id, page.name);
                      }}
                      className="p-2 rounded-lg text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all duration-300"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDelete(page.id);
                      }}
                      disabled={deletingId === page.id}
                      className="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300"
                    >
                      {deletingId === page.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}