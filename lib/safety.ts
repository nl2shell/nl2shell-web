const DANGEROUS_PATTERNS: RegExp[] = [
  /\brm\s+.*-\w*[rf]\w*/i,
  /\brm\s+-\w*R/i,
  /\bsudo\b/i,
  /\bdd\b\s+if=/i,
  /\bmkfs\b/i,
  /\bshred\b/i,
  /\bwipefs\b/i,
  /\b:\(\)\s*\{/,
  /\bchmod\s+777\b/,
  />\s*\/dev\/sd[a-z]/,
  /\bsystemctl\s+(stop|disable|mask)\b/i,
  /\bkillall\b/i,
  /\breboot\b/i,
  /\bshutdown\b/i,
  /\bpoweroff\b/i,
];

const NON_SHELL_PATTERNS: RegExp[] = [
  /^\s*import\s+/,
  /^\s*from\s+\w+\s+import\b/,
  /^\s*def\s+\w+\(/,
  /^\s*class\s+\w+/,
  /^\s*<\?php/,
  /^\s*<html/i,
  /^\s*\{"/,
];

export function isDangerous(command: string): boolean {
  return DANGEROUS_PATTERNS.some((pattern) => pattern.test(command));
}

export function looksLikeShell(command: string): boolean {
  const firstLine = command.split("\n")[0] || "";
  return !NON_SHELL_PATTERNS.some((pattern) => pattern.test(firstLine));
}

export function getDangerReason(command: string): string | null {
  const reasons: [RegExp, string][] = [
    [/\brm\s+.*-\w*[rf]\w*/i, "Recursive/forced file deletion"],
    [/\brm\s+-\w*R/i, "Recursive file deletion"],
    [/\bsudo\b/i, "Requires elevated privileges"],
    [/\bdd\b\s+if=/i, "Raw disk operation"],
    [/\bmkfs\b/i, "Filesystem format"],
    [/\bshred\b/i, "Secure file deletion"],
    [/\bwipefs\b/i, "Filesystem wipe"],
    [/\b:\(\)\s*\{/, "Potential fork bomb"],
    [/\bchmod\s+777\b/, "World-writable permissions"],
    [/>\s*\/dev\/sd[a-z]/, "Write to raw disk device"],
    [/\bsystemctl\s+(stop|disable|mask)\b/i, "Stopping system service"],
    [/\bkillall\b/i, "Kill all matching processes"],
    [/\breboot\b/i, "System reboot"],
    [/\bshutdown\b/i, "System shutdown"],
    [/\bpoweroff\b/i, "System power off"],
  ];

  for (const [pattern, reason] of reasons) {
    if (pattern.test(command)) return reason;
  }
  return null;
}
