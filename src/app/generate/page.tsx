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
  Monitor,
  Smartphone,
  User,
  Bot,
  Sparkles,
  ChevronLeft,
  Sun,
  Moon,
  Trash2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { useSession } from "@/lib/auth-client";
import { generateHtml } from "@/lib/generateHtml";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

interface ChatMessage {
  role: "user" | "ai";
  content: string;
  timestamp: number;
}

type ViewMode = "preview" | "code";

function GeneratePageInner() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<string>("");
  const [prompt, setPrompt] = useState("");
  const [projectName, setProjectName] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("preview");
  const [canvasMode, setCanvasMode] = useState<"desktop" | "mobile">("desktop");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const { data: session } = useSession();

  // Pre-fill project name from dashboard query param
  useEffect(() => {
    const nameFromQuery = searchParams.get("name");
    if (nameFromQuery) setProjectName(decodeURIComponent(nameFromQuery));
  }, [searchParams]);

  /* ─── Step 1: submit → directly generate ─────────────── */
  const handleSendClick = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!prompt.trim()) return;
    // If no project name set, auto-derive one from the prompt
    if (!projectName.trim()) setProjectName(prompt.trim().slice(0, 60));
    generatePage();
  };

  const generatePage = async (overridePrompt?: string) => {
    const finalPrompt = overridePrompt || prompt;
    if (!finalPrompt.trim()) return;

    // Add user message to thread
    const userMsg: ChatMessage = { role: "user", content: finalPrompt, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);

    setLoading(true);
    // We don't reset data here to allow iterative updates in preview

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: finalPrompt, currentHtml: data || null }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error ?? "Failed to generate");
      }

      setViewMode("preview");
      setLoading(false);

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let fullHtml = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          fullHtml += chunk;

          // Clean markdown blocks on the fly
          const cleaned = fullHtml
            .replace(/^```html\n?/, "")
            .replace(/\n?```$/, "")
            .replace(/```html/g, "")
            .replace(/```/g, "");

          setData(cleaned);
        }
      }

      // Add AI success message
      setMessages(prev => [...prev, {
        role: "ai",
        content: "I've updated the landing page for you.",
        timestamp: Date.now()
      }]);

      toast.success("Page updated!");
      setPrompt(""); // Clear input after success
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Generation failed. Try again.";
      toast.error(message);
      setLoading(false);
      setMessages(prev => [...prev, {
        role: "ai",
        content: `Sorry, I hit an error: ${message}`,
        timestamp: Date.now()
      }]);
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


  return (
    <div className="relative flex h-[calc(100vh-4rem)] bg-[#020617] text-white overflow-hidden font-sans">

      {/* 🌌 DYNAMIC BACKGROUND */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/20 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/20 blur-[120px] animate-pulse [animation-delay:2s]" />
        <div className="absolute top-[30%] left-[40%] w-[30%] h-[30%] rounded-full bg-blue-600/10 blur-[100px] animate-bounce [animation-duration:10s]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
      </div>

      {/* 🧊 CHAT SIDEBAR */}
      <motion.aside
        initial={{ x: -320, opacity: 0 }}
        animate={{ x: isSidebarOpen ? 0 : -320, opacity: 1 }}
        className="fixed md:relative z-40 w-[320px] h-full border-r border-white/10 flex flex-col bg-[#050814]/95 backdrop-blur-3xl shadow-2xl transition-all"
      >
        {/* Header */}
        <div className="p-5 border-b border-white/5 flex items-center justify-between bg-gradient-to-b from-white/5 to-transparent">
          <div className="flex items-center gap-3">
            <div className="relative group">
              <div className="absolute -inset-1 bg-indigo-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
              <div className="relative w-9 h-9 bg-indigo-500/10 rounded-lg flex items-center justify-center border border-indigo-500/20 group-hover:border-indigo-500/40 transition-all">
                <Sparkles className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-[13px] tracking-tight text-white uppercase letter-spacing-1">Workspace</span>
              <div className="flex items-center gap-1.5">
                <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[9px] text-slate-500 font-mono tracking-widest font-semibold uppercase">ONLINE</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden p-2 hover:bg-white/5 rounded-lg text-slate-500 hover:text-white transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Chat Thread */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          <AnimatePresence initial={false}>
            {messages.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col items-center justify-center h-full text-center p-2"
              >
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full animate-pulse" />
                  <div className="relative w-16 h-16 bg-indigo-600/10 rounded-2xl border border-indigo-500/20 flex items-center justify-center shadow-inner">
                    <Bot className="w-8 h-8 text-indigo-400" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-white mb-2 tracking-tight">AI Web Architect</h3>
                <p className="text-[13px] text-slate-400 px-6 leading-relaxed font-medium">
                  I can generate full landing pages from a simple description.
                </p>
                <div className="mt-8 w-full space-y-2.5">
                  {[
                    "AI Software Landing Page",
                    "Modern Portfolio Site",
                    "E-commerce Homepage"
                  ].map((s) => (
                    <motion.button
                      key={s}
                      whileHover={{ scale: 1.01, x: 3, backgroundColor: "rgba(99, 102, 241, 0.1)" }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => { setPrompt(s); generatePage(s); }}
                      className="w-full p-3.5 text-[12px] font-semibold text-left bg-white/[0.03] border border-white/5 hover:border-indigo-500/40 rounded-xl transition-all flex items-center justify-between group shadow-sm"
                    >
                      <span className="text-slate-400 group-hover:text-white transition-colors">{s}</span>
                      <ChevronLeft className="w-3 h-3 text-indigo-500/30 group-hover:text-indigo-400 rotate-180 transition-all" />
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            ) : (
              messages.map((msg, i) => (
                <motion.div
                  key={i + msg.timestamp}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
                >
                  <div className={`flex gap-3 max-w-[95%] ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg border
                      ${msg.role === "user"
                        ? "bg-indigo-600/20 border-indigo-500/30 text-indigo-400"
                        : "bg-emerald-600/20 border-emerald-500/30 text-emerald-400"}`}>
                      {msg.role === "user" ? <User size={14} /> : <Sparkles size={14} />}
                    </div>
                    <div className={`p-3.5 rounded-2xl text-[13px] leading-relaxed shadow-xl backdrop-blur-xl border
                      ${msg.role === "user"
                        ? "bg-indigo-600/90 text-white rounded-tr-none border-white/10"
                        : "bg-slate-900/90 border-white/5 text-slate-200 rounded-tl-none"}`}>
                      {msg.content}
                    </div>
                  </div>
                  <span className={`mt-1.5 text-[9px] font-bold uppercase tracking-widest opacity-25 ${msg.role === "user" ? "mr-10" : "ml-10"}`}>
                    {msg.role === "user" ? "Human" : "System Core"}
                  </span>
                </motion.div>
              ))
            )}
            {loading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3.5 items-start"
              >
                <div className="w-9 h-9 rounded-[14px] bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center animate-pulse">
                  <Loader2 size={16} className="text-emerald-400 animate-spin" />
                </div>
                <div className="bg-slate-900/90 border border-white/5 p-4 rounded-2xl rounded-tl-none text-[13.5px] text-slate-400 flex flex-col gap-3 backdrop-blur-xl shadow-2xl">
                  <div className="flex gap-1.5">
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                  <span className="font-medium">Synthesizing design components...</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Input area */}
        <div className="p-5 border-t border-white/5 bg-[#050814]">
          <form onSubmit={handleSendClick} className="relative group">
            <div className="absolute -inset-0.5 bg-indigo-500/10 rounded-2xl opacity-10 group-focus-within:opacity-30 transition-opacity blur-md" />
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendClick();
                }
              }}
              placeholder="Refine or ask for changes..."
              className="relative w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-3.5 pr-12 text-[13px] text-white
                placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500/40
                resize-none h-[64px] max-h-40 transition-all custom-scrollbar font-medium"
            />
            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              className="absolute right-2.5 bottom-2.5 p-2
                bg-indigo-600 text-white rounded-lg shadow-lg
                hover:bg-indigo-500 disabled:opacity-30 transition-all active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
          <div className="mt-3.5 flex items-center justify-center gap-1.5 text-[9px] text-slate-600 font-bold uppercase tracking-widest">
            <div className="w-1 h-1 bg-slate-800 rounded-full" />
            Gemini-3-Flash-preview
            <div className="w-1 h-1 bg-slate-800 rounded-full" />
          </div>
        </div>
      </motion.aside>

      {/* 🧠 MAIN WORKSPACE */}
      <main className="flex-1 relative flex flex-col min-w-0 bg-slate-950">

        {/* Toolbar */}
        <div className="h-14 border-b border-white/10 flex items-center justify-between px-6 bg-slate-900/40 backdrop-blur-2xl flex-shrink-0 z-10">
          <div className="flex items-center gap-4">
            {!isSidebarOpen && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 hover:bg-white/5 rounded-lg text-indigo-400 border border-indigo-500/20"
              >
                <Sparkles className="w-4 h-4" />
              </motion.button>
            )}

            {/* Desktop/Mobile Toggle */}
            {viewMode === "preview" && (
              <div className="flex bg-black/40 p-1 rounded-xl border border-white/5 shadow-inner">
                <button
                  onClick={() => setCanvasMode("desktop")}
                  className={`p-1.5 rounded-lg transition-all duration-300 ${canvasMode === "desktop" ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" : "text-slate-500 hover:text-white"}`}
                >
                  <Monitor className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCanvasMode("mobile")}
                  className={`p-1.5 rounded-lg transition-all duration-300 ${canvasMode === "mobile" ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" : "text-slate-500 hover:text-white"}`}
                >
                  <Smartphone className="w-4 h-4" />
                </button>
              </div>
            )}

            <div className="flex bg-black/40 p-1 rounded-xl border border-white/5 shadow-inner">
              <button
                onClick={() => setViewMode("preview")}
                className={`flex items-center gap-2 px-4 py-1.5 text-xs font-semibold rounded-lg transition-all duration-300 ${viewMode === "preview" ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" : "text-slate-400 hover:text-white"
                  }`}
              >
                <Eye className="w-3.5 h-3.5" /> Preview
              </button>
              <button
                onClick={() => setViewMode("code")}
                disabled={!data}
                className={`flex items-center gap-2 px-4 py-1.5 text-xs font-semibold rounded-lg transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed ${viewMode === "code" ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" : "text-slate-400 hover:text-white"
                  }`}
              >
                <Code className="w-3.5 h-3.5" /> Code
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {data && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => downloadHtml(data, projectName || "landing-page")}
                className="p-2.5 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/10 rounded-xl transition-all"
                title="Download HTML"
              >
                <Download className="w-4 h-4" />
              </motion.button>
            )}

            <motion.button
              whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(99, 102, 241, 0.4)" }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSave}
              disabled={!data || saving}
              className="flex items-center gap-2 px-5 py-2
                bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-500/25
                disabled:opacity-30 transition-all border border-indigo-400/30"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Project
            </motion.button>
          </div>
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-hidden relative bg-slate-900/30 flex items-center justify-center">
          <AnimatePresence mode="wait">

            {/* Empty state */}
            {!data && !loading && (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="flex flex-col items-center justify-center text-center p-10"
              >
                <div className="relative mb-8">
                  <div className="absolute inset-0 bg-indigo-500/10 blur-[60px] rounded-full" />
                  <motion.div
                    animate={{ rotate: [0, 8, -8, 0] }}
                    transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
                    className="relative w-24 h-24 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-3xl flex items-center justify-center border border-white/10 shadow-[0_0_40px_rgba(99,102,241,0.08)] backdrop-blur-2xl"
                  >
                    <Terminal className="w-10 h-10 text-indigo-400" />
                  </motion.div>
                </div>
                <h2 className="text-3xl font-bold mb-3 tracking-tighter text-white">
                  Creative <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Canvas</span>
                </h2>
                <p className="text-slate-400 text-base max-w-sm leading-relaxed font-medium">
                  Your intelligent workspace is ready. Type a prompt to begin generating your masterpiece.
                </p>
                <div className="mt-10 flex items-center gap-8 text-slate-700">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-colors hover:text-indigo-400 cursor-default"><Monitor size={14} /> Live Preview</div>
                  <div className="w-1 h-1 rounded-full bg-slate-800" />
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-colors hover:text-indigo-400 cursor-default"><Code size={14} /> Code Export</div>
                </div>
              </motion.div>
            )}

            {/* Preview View */}
            {data && viewMode === "preview" && (
              <motion.div
                key="preview-container"
                initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
                className={`transition-all duration-1000 ease-[cubic-bezier(0.2,1,0.2,1)] bg-white shadow-[0_60px_120px_-20px_rgba(0,0,0,0.8)] overflow-hidden relative
                  ${canvasMode === "mobile"
                    ? "w-[380px] h-[780px] rounded-[3.5rem] border-[14px] border-[#0f172a] ring-2 ring-white/10 shadow-indigo-500/20 my-8"
                    : "w-full h-full"}
                `}
              >
                {canvasMode === "mobile" && (
                  <>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-7 bg-[#0f172a] rounded-b-3xl z-20 flex items-center justify-center">
                      <div className="w-16 h-1.5 bg-slate-800 rounded-full" />
                    </div>
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-slate-800/40 rounded-full z-20" />
                  </>
                )}
                <iframe
                  srcDoc={data}
                  className="w-full h-full border-0 bg-white"
                  title="Preview"
                  sandbox="allow-scripts allow-same-origin"
                />
                {loading && (
                  <div className="absolute inset-0 bg-[#020617]/40 backdrop-blur-[2px] flex flex-col items-center justify-center z-30">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="bg-[#050814]/90 border border-white/10 px-6 py-3 rounded-full text-xs font-bold text-white flex items-center gap-3 shadow-2xl"
                    >
                      <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" />
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                      </div>
                      LIVE UPDATING WORKSPACE
                    </motion.div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Code View (Editable) */}
            {data && viewMode === "code" && (
              <motion.div
                key="code-container"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="w-full h-full p-6 flex flex-col"
              >
                <div className="flex-1 rounded-xl border border-white/10 bg-slate-950 overflow-hidden flex flex-col">
                  <div className="px-4 py-3 border-b border-white/5 bg-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50" />
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50" />
                      </div>
                      <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest ml-4">index.html</span>
                    </div>
                    <button
                      onClick={() => { navigator.clipboard.writeText(data); toast.success("Copied to clipboard!"); }}
                      className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors bg-indigo-500/10 px-2 py-1 rounded"
                    >
                      COPY SOURCE
                    </button>
                  </div>
                  <textarea
                    value={data}
                    onChange={(e) => setData(e.target.value)}
                    className="flex-1 w-full p-8 bg-[#010409] text-emerald-400/90 font-mono text-[13px] leading-relaxed resize-none focus:outline-none custom-scrollbar selection:bg-indigo-500/30"
                    spellCheck={false}
                  />
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