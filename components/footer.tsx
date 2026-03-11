"use client";

import { useState } from "react";

export function Footer() {
  const [copied, setCopied] = useState(false);

  const installCmd = "ollama run hf.co/AryaYT/nl2shell-0.8b";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(installCmd);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <footer className="border-t border-border/40 mt-20 pt-16 pb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto px-4">
        {/* Left: Install CTA */}
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            Want this in your terminal?
          </h3>
          <p className="text-sm text-muted-foreground/70 mt-1">
            One command. Works offline forever.
          </p>
          <div className="terminal-output px-4 py-3 mt-4 flex items-center justify-between gap-3">
            <code className="text-[var(--terminal-green)] text-sm font-mono truncate">
              {installCmd}
            </code>
            <button
              onClick={handleCopy}
              className="shrink-0 text-muted-foreground/50 hover:text-foreground transition-colors"
              aria-label="Copy install command"
            >
              {copied ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="size-4"><path d="M20 6 9 17l-5-5" /></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="size-4"><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></svg>
              )}
            </button>
          </div>
          <p className="text-[11px] text-muted-foreground/40 mt-2">
            No account. No API key. No cloud dependency.
          </p>
        </div>

        {/* Right: Links */}
        <div className="grid grid-cols-2 gap-6 text-sm">
          <div>
            <h4 className="font-medium text-foreground/80 mb-3 text-xs uppercase tracking-wider">Model</h4>
            <ul className="space-y-2">
              <li>
                <a href="https://huggingface.co/AryaYT/nl2shell-0.8b" target="_blank" rel="noopener noreferrer" className="text-muted-foreground/60 hover:text-primary transition-colors">
                  HuggingFace Model
                </a>
              </li>
              <li>
                <a href="https://huggingface.co/spaces/AryaYT/nl2shell-demo" target="_blank" rel="noopener noreferrer" className="text-muted-foreground/60 hover:text-primary transition-colors">
                  Gradio Demo
                </a>
              </li>
              <li>
                <a href="https://huggingface.co/datasets/AryaYT/nl2shell-training-v3" target="_blank" rel="noopener noreferrer" className="text-muted-foreground/60 hover:text-primary transition-colors">
                  Training Data
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-foreground/80 mb-3 text-xs uppercase tracking-wider">Source</h4>
            <ul className="space-y-2">
              <li>
                <a href="https://github.com/aryateja2106/vox" target="_blank" rel="noopener noreferrer" className="text-muted-foreground/60 hover:text-primary transition-colors">
                  Vox CLI
                </a>
              </li>
              <li>
                <a href="https://github.com/aryateja2106/cloudagi" target="_blank" rel="noopener noreferrer" className="text-muted-foreground/60 hover:text-primary transition-colors">
                  CloudAGI
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border/30 mt-10 pt-6 text-center">
        <p className="text-[11px] text-muted-foreground/30">
          400MB model. Runs on your machine. Does one thing well.
        </p>
      </div>
    </footer>
  );
}
