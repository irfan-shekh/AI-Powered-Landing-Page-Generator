"use client";

import React, { useState, useEffect, useCallback } from "react";
import { LandingPageData } from "@/components/landing-page/Renderer";
import {
  Loader2,
  Save,
  Send,
  Code,
  Eye,
  History,
  Terminal,
  FileText,
  Download,
  FolderOpen,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { useSession } from "@/lib/auth-client";
import { generateHtml } from "@/lib/generateHtml";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

type ViewMode = "preview" | "code";

interface SavedPage {
  id: string;
  name: string;
  content: LandingPageData;
  createdAt: string;
}

function GeneratePageInner() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<any | null>(null);
  const [prompt, setPrompt] = useState("");
  const [projectName, setProjectName] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("preview");
  const [history, setHistory] = useState<SavedPage[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const { data: session } = useSession();

  // Pre-fill project name from dashboard query param
  useEffect(() => {
    const nameFromQuery = searchParams.get("name");
    if (nameFromQuery) setProjectName(decodeURIComponent(nameFromQuery));
  }, [searchParams]);

  /* ─── Load history ────────────────────────────────────── */
  const fetchHistory = useCallback(async () => {
    if (!session?.user) return;
    setHistoryLoading(true);
    try {
      const res = await fetch("/api/pages");
      if (res.ok) setHistory(await res.json());
    } catch {
      // ignore
    } finally {
      setHistoryLoading(false);
    }
  }, [session?.user]);

  useEffect(() => { fetchHistory(); }, [fetchHistory]);

  /* ─── Step 1: submit → directly generate ─────────────── */
  const handleSendClick = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!prompt.trim()) return;
    // If no project name set, auto-derive one from the prompt
    if (!projectName.trim()) setProjectName(prompt.trim().slice(0, 60));
    generatePage();
  };

  const generatePage = async () => {
    setLoading(true);
    setData("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, currentHtml: data && typeof data === 'string' ? data : null }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error ?? "Failed to generate");
      }

      setViewMode("preview");
      setLoading(false); // Stop the global loading spinner so user can see stream

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let fullHtml = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          fullHtml += decoder.decode(value, { stream: true });
          setData(fullHtml);
        }
      }
      toast.success("Page generated!");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Generation failed. Try again.";
      toast.error(message);
      setLoading(false);
    }
  };

  /* ─── Save to backend + download HTML ────────────────── */
  const handleSave = async () => {
    if (!data) return;
    setSaving(true);

    const name = projectName.trim() || "Untitled Page";
    const htmlContent = typeof data === 'string' ? data : generateHtml(data, name);

    if (session?.user) {
      try {
        const res = await fetch("/api/pages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, content: data }),
        });
        if (res.ok) {
          toast.success("Saved to your projects!");
          fetchHistory();
        } else {
          toast.error("Could not save to backend.");
        }
      } catch {
        toast.error("Network error while saving.");
      }
    } else {
      toast("Sign in to save pages to your account.", { icon: "ℹ️" });
    }

    downloadHtml(htmlContent, name);
    setSaving(false);
  };

  /* ─── Download HTML ───────────────────────────────────── */
  const downloadHtml = (htmlContent: string, name: string) => {
    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${name.replace(/\s+/g, "-").toLowerCase()}.html`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("HTML file downloaded!");
  };

  /* ─── Load history item into view ────────────────────── */
  const loadSavedPage = (page: SavedPage) => {
    setData(page.content);
    setPrompt(page.name);
    setProjectName(page.name);
    setViewMode("preview");
    toast.success(`Loaded: ${page.name}`);
  };

  const htmlCode = data ? (typeof data === 'string' ? data : generateHtml(data, projectName || "Landing Page")) : "";

  return (
    <div className="relative flex h-[calc(100vh-4rem)] bg-[#020617] text-white overflow-hidden">

      {/* 🌌 BACKGROUND */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.25),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(168,85,247,0.25),transparent_40%)] animate-pulse" />
        <div className="absolute top-[-120px] left-[20%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] animate-[spin_25s_linear_infinite]" />
        <div className="absolute bottom-[-120px] right-[10%] w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[100px] animate-[spin_30s_linear_infinite]" />
      </div>

      {/* 🧊 SIDEBAR */}
      <motion.aside
        initial={{ x: -80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-80 border-r border-white/10 flex flex-col bg-white/5 backdrop-blur-xl shadow-[0_0_40px_rgba(0,0,0,0.6)]"
      >
        {/* History header */}
        <div className="p-4 border-b border-white/10 flex items-center gap-2 text-indigo-400">
          <History className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-widest">History</span>
        </div>

        {/* History list */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {!session?.user ? (
            <p className="text-xs text-slate-500 italic p-1">Sign in to see your saved pages.</p>
          ) : historyLoading ? (
            <div className="flex items-center gap-2 text-xs text-slate-500 p-1">
              <Loader2 className="w-3 h-3 animate-spin" /> Loading...
            </div>
          ) : history.length === 0 ? (
            <p className="text-xs text-slate-500 italic p-1">No saved pages yet.</p>
          ) : (
            history.map((page) => (
              <button
                key={page.id}
                onClick={() => loadSavedPage(page)}
                className="w-full text-left p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10
                  transition-all group flex items-start gap-2"
              >
                <FileText className="w-3.5 h-3.5 text-indigo-400 mt-0.5 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white truncate">{page.name}</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {new Date(page.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <Download
                  className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400 flex-shrink-0 ml-auto mt-0.5 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    const html = typeof page.content === 'string' ? page.content : generateHtml(page.content, page.name);
                    downloadHtml(html, page.name);
                  }}
                />
              </button>
            ))
          )}
        </div>

        {/* Prompt input */}
        <div className="p-4 border-t border-white/10">
          {/* Show active project name if set */}
          {projectName && (
            <div className="flex items-center gap-2 mb-2 px-1">
              <FolderOpen className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
              <span className="text-xs text-indigo-300 font-medium truncate">{projectName}</span>
            </div>
          )}
          <form onSubmit={handleSendClick} className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) handleSendClick();
              }}
              placeholder="✨ Describe your landing page... (Ctrl+Enter to send)"
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 pr-12 text-sm
                focus:outline-none focus:ring-2 focus:ring-indigo-500/60
                resize-none min-h-[100px] backdrop-blur-md placeholder:text-slate-600"
            />
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              type="submit"
              disabled={loading || !prompt.trim()}
              className="absolute bottom-3 right-3 p-2
                bg-gradient-to-r from-indigo-500 to-purple-500
                rounded-lg shadow-lg hover:shadow-indigo-500/40
                transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </motion.button>
          </form>
        </div>
      </motion.aside>

      {/* 🧠 MAIN */}
      <main className="flex-1 relative flex flex-col min-w-0">

        {/* Top bar */}
        <div className="h-14 border-b border-white/10 flex items-center justify-between px-6 bg-black/30 backdrop-blur-xl flex-shrink-0">
          <div className="flex items-center gap-4">
            {/* Project name badge */}
            {projectName && (
              <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                <FolderOpen className="w-3.5 h-3.5 text-indigo-400" />
                <span className="text-xs font-semibold text-indigo-300 max-w-[180px] truncate">{projectName}</span>
              </div>
            )}

            <div className="flex bg-white/5 p-1 rounded-lg border border-white/10">
              <button
                id="btn-preview"
                onClick={() => setViewMode("preview")}
                className={`flex items-center gap-2 px-3 py-1 text-xs font-medium rounded-md transition-all ${
                  viewMode === "preview" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                <Eye className="w-3.5 h-3.5" /> Preview
              </button>
              <button
                id="btn-code"
                onClick={() => setViewMode("code")}
                disabled={!data}
                className={`flex items-center gap-2 px-3 py-1 text-xs font-medium rounded-md transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                  viewMode === "code" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                <Code className="w-3.5 h-3.5" /> Code
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {data && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => downloadHtml(htmlCode, projectName || "landing-page")}
                className="flex items-center gap-2 px-3 py-1.5
                  bg-white/10 text-white border border-white/15
                  rounded-lg text-xs font-semibold hover:bg-white/20 transition-all"
              >
                <Download className="w-3.5 h-3.5" /> Download
              </motion.button>
            )}

            <motion.button
              id="btn-save"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSave}
              disabled={!data || saving}
              className="flex items-center gap-2 px-4 py-1.5
                bg-gradient-to-r from-white to-slate-200 text-black
                rounded-lg text-sm font-bold shadow-lg
                disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save
            </motion.button>
          </div>
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-auto relative">
          <AnimatePresence mode="wait">

            {/* Empty state */}
            {!data && !loading && (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center text-center p-10"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
                  className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6 border border-white/10"
                >
                  <Terminal className="w-8 h-8 text-indigo-400" />
                </motion.div>
                <h2 className="text-2xl font-bold mb-2">Ready to Build</h2>
                <p className="text-slate-400 max-w-sm">
                  Describe your landing page, give it a name, and let AI do the rest.
                </p>
              </motion.div>
            )}

            {/* Loading */}
            {loading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-xl z-50"
              >
                <div className="relative">
                  <Loader2 className="w-14 h-14 text-indigo-500 animate-spin" />
                  <div className="absolute inset-0 blur-2xl bg-indigo-500/40 animate-pulse" />
                </div>
                <p className="mt-4 text-lg font-bold text-white">{projectName || "Your Page"}</p>
                <p className="mt-2 text-indigo-300 font-mono animate-pulse tracking-widest uppercase text-xs">
                  Generating Magic...
                </p>
              </motion.div>
            )}

            {/* Preview */}
            {data && !loading && viewMode === "preview" && (
              <motion.div
                key="preview"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="w-full h-full"
              >
                <iframe
                  srcDoc={htmlCode}
                  className="w-full h-full border-0 bg-white"
                  title="Preview"
                  sandbox="allow-scripts allow-same-origin"
                />
              </motion.div>
            )}

            {/* Code view */}
            {data && !loading && viewMode === "code" && (
              <motion.div
                key="code"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="w-full h-full p-6"
              >
                <div className="rounded-xl border border-white/10 bg-black/60 backdrop-blur-md overflow-auto h-full flex flex-col">
                  <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10 bg-white/5 flex-shrink-0">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500/80" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                      <div className="w-3 h-3 rounded-full bg-green-500/80" />
                      <span className="ml-3 text-xs text-slate-400 font-mono">
                        {(projectName || "landing-page").replace(/\s+/g, "-").toLowerCase()}.html
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(htmlCode);
                        toast.success("Copied to clipboard!");
                      }}
                      className="text-xs text-slate-400 hover:text-white transition-colors px-2 py-1 rounded bg-white/5 hover:bg-white/10"
                    >
                      Copy
                    </button>
                  </div>
                  <pre className="p-6 text-sm font-mono text-emerald-300 leading-relaxed whitespace-pre overflow-x-auto flex-1">
                    {htmlCode}
                  </pre>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

export default function GeneratePage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center bg-[#020617]">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        </div>
      }
    >
      <GeneratePageInner />
    </Suspense>
  );
}