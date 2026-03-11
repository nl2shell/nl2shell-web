import { ShellSession } from "@/components/shell-session";
import { HeroTerminal } from "@/components/hero-terminal";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-background relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(46,164,79,0.08)_0%,transparent_70%)]" />

      {/* Hero Section */}
      <section className="relative mx-auto max-w-4xl px-4 pt-16 sm:pt-24 pb-8 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/50 backdrop-blur-sm px-4 py-1.5 text-xs text-muted-foreground mb-8">
          <span className="inline-block size-2 rounded-full bg-[#2ea44f] animate-pulse" />
          Powered by a fine-tuned 800M parameter model
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]">
          Stop using ChatGPT for{" "}
          <span className="text-gradient-green">shell commands</span>.
        </h1>
        <p className="text-xl sm:text-2xl text-muted-foreground font-light mt-4">
          Just type what you want. Get the command instantly.
        </p>
        <p className="text-sm text-muted-foreground/60 mt-3 max-w-lg mx-auto">
          Plain English to terminal commands — locally, instantly, privately. No API keys, no cloud, no subscription.
        </p>

        <div className="mt-10 mb-6">
          <HeroTerminal />
        </div>

        {/* Stats bar */}
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 mt-8 text-sm text-muted-foreground/70">
          <div className="flex items-center gap-2">
            <span className="font-mono text-foreground/90 font-semibold">12,834</span>
            <span>training pairs</span>
          </div>
          <div className="hidden sm:block h-4 w-px bg-border" />
          <div className="flex items-center gap-2">
            <span className="font-mono text-foreground/90 font-semibold">400MB</span>
            <span>runs offline</span>
          </div>
          <div className="hidden sm:block h-4 w-px bg-border" />
          <div className="flex items-center gap-2">
            <span className="font-mono text-foreground/90 font-semibold">&lt;1s</span>
            <span>latency</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-3 mt-10 mb-12">
          <a
            href="#translate"
            className="inline-flex items-center justify-center bg-[#2ea44f] hover:bg-[#238636] text-white px-6 py-3 text-sm rounded-lg font-medium transition-all hover:shadow-[0_0_20px_rgba(46,164,79,0.3)]"
          >
            Try it now — free
          </a>
          <a
            href="#install"
            className="inline-flex items-center justify-center border border-border/60 hover:border-primary/40 text-muted-foreground hover:text-foreground px-6 py-3 text-sm rounded-lg font-medium transition-all backdrop-blur-sm"
          >
            Install locally
          </a>
        </div>
      </section>

      {/* Translate Section */}
      <section id="translate" className="relative mx-auto max-w-3xl px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
          <span className="text-xs font-mono text-muted-foreground/50 uppercase tracking-widest">
            translate
          </span>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
        </div>
        <ShellSession />
      </section>

      {/* Footer */}
      <div id="install">
        <Footer />
      </div>
    </main>
  );
}
