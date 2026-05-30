"use client";

import React from "react";

interface PreviewIframeProps {
  htmlContent: string;
  className?: string;
}

export default function PreviewIframe({ htmlContent, className }: PreviewIframeProps) {
  const handleIframeLoad = (e: React.SyntheticEvent<HTMLIFrameElement>) => {
    const iframe = e.currentTarget;
    try {
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      if (iframeDoc) {
        // Intercept hash link clicks inside the iframe document
        iframeDoc.addEventListener("click", (event: MouseEvent) => {
          const target = event.target as HTMLElement;
          const link = target.closest('a[href^="#"]');
          if (link) {
            const href = link.getAttribute("href");
            if (href) {
              event.preventDefault();
              if (iframe.contentWindow) {
                // Update the hash in the iframe dynamically
                iframe.contentWindow.location.hash = href;
                
                interface PreviewWindow extends Window {
                  navigateTo?: (hash: string) => void;
                }
                const win = iframe.contentWindow as PreviewWindow;
                // Trigger the generated SPA router page transition directly
                if (win.navigateTo) {
                  win.navigateTo(href);
                } else {
                  // Fallback: dispatch natural hashchange event to trigger navigation
                  const hashEvent = new HashChangeEvent("hashchange");
                  win.dispatchEvent(hashEvent);
                }
              }
            }
          }
        });
      }
    } catch (err) {
      console.error("Failed to intercept iframe clicks:", err);
    }
  };

  return (
    <iframe
      srcDoc={htmlContent}
      onLoad={handleIframeLoad}
      className={className || "w-full h-full border-0 bg-white"}
      title="Preview"
      sandbox="allow-scripts allow-same-origin"
    />
  );
}
