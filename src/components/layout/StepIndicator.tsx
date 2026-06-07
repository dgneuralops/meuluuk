"use client";

interface StepIndicatorProps {
  steps: string[];
  current: number;
  className?: string;
}

export function StepIndicator({
  steps,
  current,
  className = "",
}: StepIndicatorProps) {
  return (
    <div className={`flex items-center gap-0 ${className}`}>
      {steps.map((step, index) => {
        const isCompleted = index < current;
        const isCurrent = index === current;

        return (
          <div key={step} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div
                className={`
                  w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold
                  transition-all duration-300 ease-out
                  ${isCompleted ? "bg-primary text-white shadow-md" : ""}
                  ${isCurrent ? "bg-primary text-white ring-4 ring-primary/20 shadow-lg scale-110" : ""}
                  ${!isCompleted && !isCurrent ? "bg-surface text-muted border-2 border-border" : ""}
                `}
              >
                {isCompleted ? (
                  <span className="material-icons-outlined text-lg">check</span>
                ) : (
                  index + 1
                )}
              </div>
              <span
                className={`
                  mt-2 text-[10px] font-semibold text-center leading-tight uppercase tracking-wide
                  transition-colors duration-300
                  ${isCurrent ? "text-foreground" : "text-muted"}
                `}
              >
                {step}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`
                  flex-1 h-0.5 mx-2 mb-6 rounded-full transition-all duration-500 ease-out
                  ${index < current ? "bg-primary" : "bg-border"}
                `}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
