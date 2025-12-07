import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  variant?: "default" | "success" | "warning" | "error" | "info";
  className?: string;
}

const statusVariants: Record<string, "success" | "warning" | "error" | "info" | "default"> = {
  pending: "warning",
  approved: "success",
  rejected: "error",
  completed: "info",
  Good: "success",
  Fair: "warning",
  Poor: "error",
};

export function StatusBadge({ status, variant, className }: StatusBadgeProps) {
  const resolvedVariant = variant || statusVariants[status] || "default";

  const variantClasses = {
    default: "bg-muted text-muted-foreground",
    success: "bg-success/10 text-success border-success/20",
    warning: "bg-warning/10 text-warning border-warning/20",
    error: "bg-destructive/10 text-destructive border-destructive/20",
    info: "bg-primary/10 text-primary border-primary/20",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize transition-colors",
        variantClasses[resolvedVariant],
        className
      )}
    >
      {status}
    </span>
  );
}
