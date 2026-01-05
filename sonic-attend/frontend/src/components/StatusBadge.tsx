import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "pending" | "confirmed" | "invalid" | "waiting" | "active";
  className?: string;
}

const statusConfig = {
  pending: {
    label: "Pending",
    className: "bg-warning/10 text-warning border-warning/30",
  },
  confirmed: {
    label: "Confirmed",
    className: "bg-success/10 text-success border-success/30",
  },
  invalid: {
    label: "Invalid",
    className: "bg-destructive/10 text-destructive border-destructive/30",
  },
  waiting: {
    label: "Waiting for Sound",
    className: "bg-primary/10 text-primary border-primary/30",
  },
  active: {
    label: "Session Active",
    className: "bg-cyan/10 text-cyan border-cyan/30",
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border",
        config.className,
        className
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
      {config.label}
    </span>
  );
}
