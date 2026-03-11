"use client";

const CATEGORIES = [
  {
    label: "Files & Search",
    icon: "📁",
    examples: [
      "list all files sorted by size",
      "find Python files modified today",
      "compress src directory into a tar.gz",
      "find and delete all node_modules",
    ],
  },
  {
    label: "Processes & Ports",
    icon: "⚡",
    examples: [
      "kill the process using port 3000",
      "show which process uses the most CPU",
      "show all running Docker containers",
      "list all open network connections",
    ],
  },
  {
    label: "Git & DevOps",
    icon: "🔀",
    examples: [
      "git log one-line last 20 commits",
      "create a branch called feature-auth",
      "check SSL cert expiry of example.com",
      "watch a directory for file changes",
    ],
  },
  {
    label: "System",
    icon: "🖥",
    examples: [
      "show disk usage of current directory",
      "count lines of code in TypeScript files",
      "generate a random 32-char password",
    ],
  },
];

interface ExamplePromptsProps {
  onSelect: (example: string) => void;
  disabled?: boolean;
}

export function ExamplePrompts({ onSelect, disabled }: ExamplePromptsProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-border/30" />
        <span className="text-[11px] font-mono text-muted-foreground/40 uppercase tracking-widest">
          examples
        </span>
        <div className="h-px flex-1 bg-border/30" />
      </div>
      {CATEGORIES.map((category) => (
        <div key={category.label}>
          <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground/50 mb-2.5 flex items-center gap-1.5">
            <span className="text-[10px]">{category.icon}</span>
            {category.label}
          </p>
          <div className="flex flex-wrap gap-2">
            {category.examples.map((example) => (
              <button
                key={example}
                onClick={() => onSelect(example)}
                disabled={disabled}
                className="rounded-lg border border-border/30 bg-card/40 px-3.5 py-2 text-[13px] text-muted-foreground/70 transition-all hover:border-primary/30 hover:text-foreground hover:bg-card/60 hover:shadow-[0_0_12px_rgba(46,164,79,0.06)] disabled:opacity-40 disabled:cursor-not-allowed text-left"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
