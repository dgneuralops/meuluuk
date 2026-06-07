"use client";

import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

interface ResultLoadingProps {
  progress?: number;
}

export function ResultLoading({ progress = 0 }: ResultLoadingProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
      <div className="relative mb-10">
        <div className="w-28 h-28 rounded-full border-4 border-border border-t-primary animate-spin" />
        <div className="absolute inset-3 rounded-full bg-primary/5 animate-pulse" />
      </div>
      <LoadingSpinner size="lg" text="Gerando seu look..." />
      <div className="mt-8 w-full max-w-xs">
        <div className="h-2 bg-surface rounded-full overflow-hidden border border-border">
          <div
            className="h-full bg-gradient-to-r from-primary to-primary-hover rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${Math.min(progress, 95)}%` }}
          />
        </div>
        <p className="mt-3 text-xs text-muted text-center tabular-nums">
          {Math.round(Math.min(progress, 95))}%
        </p>
      </div>
      <div className="mt-6 bg-surface rounded-xl p-4 border border-border max-w-xs">
        <div className="flex items-start gap-3">
          <span className="material-icons-outlined text-lg text-primary mt-0.5">
            auto_awesome
          </span>
          <p className="text-xs text-muted leading-relaxed">
            Estamos aplicando suas peças na foto com inteligência artificial.
            {progress < 20 && " A primeira geração pode levar 2-3 minutos para aquecer o modelo."}
          </p>
        </div>
      </div>
    </div>
  );
}
