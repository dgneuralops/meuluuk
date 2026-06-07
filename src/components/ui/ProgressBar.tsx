"use client";

interface ProgressBarProps {
  current: number;
  total: number;
  className?: string;
}

export function ProgressBar({
  current,
  total,
  className = "",
}: ProgressBarProps) {
  const percentage = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex-1 h-1.5 bg-surface rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-xs text-muted font-medium tabular-nums">
        {current}/{total}
      </span>
    </div>
  );
}
