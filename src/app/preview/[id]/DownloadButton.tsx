"use client";

import { Download } from "lucide-react";
import toast from "react-hot-toast";

interface DownloadButtonProps {
  html: string;
  name: string;
}

export default function DownloadButton({ html, name }: DownloadButtonProps) {
  const handleDownload = () => {
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${name.replace(/\s+/g, "-").toLowerCase()}.html`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("HTML downloaded!");
  };

  return (
    <button
      onClick={handleDownload}
      className="flex items-center gap-2 px-4 py-1.5
        bg-gradient-to-r from-indigo-500 to-purple-500
        rounded-lg text-sm font-semibold text-white
        shadow-lg hover:scale-105 hover:shadow-indigo-500/40
        transition-all duration-200"
    >
      <Download className="w-4 h-4" />
      Download HTML
    </button>
  );
}
