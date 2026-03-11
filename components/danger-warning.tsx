import { Badge } from "@/components/ui/badge";

interface DangerWarningProps {
  reason: string;
}

export function DangerWarning({ reason }: DangerWarningProps) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/10 px-3 py-2">
      <Badge variant="destructive" className="shrink-0">
        Warning
      </Badge>
      <p className="text-sm text-destructive">
        {reason}. Review this command carefully before running.
      </p>
    </div>
  );
}
