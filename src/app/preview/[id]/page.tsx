import { prisma } from "@/lib/auth";
import { LandingPageRenderer, LandingPageData } from "@/components/landing-page/Renderer";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import { generateHtml } from "@/lib/generateHtml";
import DownloadButton from "./DownloadButton";

export default async function PreviewPage({
  params,
}: {
  // In this Next.js version params is a Promise — must be awaited
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const page = await prisma.page.findUnique({
    where: { id },
  });

  if (!page) {
    notFound();
  }

  const isHtmlString = typeof page.content === 'string';
  const data = page.content as any;
  const isDark = isHtmlString ? true : (data?.brand?.variant === 'dark' || data?.brand?.variant === 'glassmorphism');
  const htmlContent = isHtmlString ? data : generateHtml(data as LandingPageData, page.name);

  return (
    <div className={`relative min-h-screen overflow-hidden ${isDark ? 'bg-[#020617] text-white' : 'bg-white text-slate-900'}`}>

      {/* 🌌 BACKGROUND (Only show glows in dark mode) */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className={`absolute inset-0 ${isDark ? 'bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.25),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(168,85,247,0.25),transparent_40%)] animate-pulse' : 'bg-slate-50'}`} />
        {isDark && (
          <>
            <div className="absolute top-[-120px] left-[30%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] animate-[spin_25s_linear_infinite]" />
            <div className="absolute bottom-[-120px] right-[10%] w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[100px] animate-[spin_30s_linear_infinite]" />
          </>
        )}
      </div>

      {/* 🧊 TOP BAR */}
      <header className={`sticky top-0 z-50 backdrop-blur-xl border-b px-6 py-3 flex items-center justify-between shadow-[0_10px_30px_rgba(0,0,0,0.4)] ${isDark ? 'bg-white/5 border-white/10' : 'bg-white/80 border-slate-200'}`}>
        <div className="flex items-center gap-4">

          {/* BACK BUTTON */}
          <Link
            href="/dashboard"
            className={`group flex items-center gap-2 text-sm font-medium transition-all ${isDark ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-black'}`}
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back
          </Link>

          <div className={`h-4 w-px ${isDark ? 'bg-white/10' : 'bg-slate-200'}`} />

          {/* PAGE NAME */}
          <div className="flex items-center gap-2">
            <Sparkles className={`w-4 h-4 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
            <span className={`text-sm font-semibold tracking-wide ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {page.name}
            </span>
          </div>
        </div>

        {/* Download HTML — client component because it uses Blob API */}
        <DownloadButton html={htmlContent} name={page.name} />
      </header>

      {/* 🚀 CONTENT */}
      <main className="relative flex-1">
        {isHtmlString ? (
          <iframe
            srcDoc={htmlContent}
            className="w-full h-[calc(100vh-4rem)] border-0 bg-white"
            title="Preview"
            sandbox="allow-scripts allow-same-origin"
          />
        ) : (
          <LandingPageRenderer data={data as LandingPageData} />
        )}
      </main>
    </div>
  );
}