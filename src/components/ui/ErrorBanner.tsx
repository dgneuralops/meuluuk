"use client";

interface ErrorBannerProps {
  message: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorBanner({
  message,
  onRetry,
  className = "",
}: ErrorBannerProps) {
  return (
    <div
      className={`
        flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-xl
        ${className}
      `}
    >
      <span className="material-icons-outlined text-red-500 text-xl mt-0.5">
        error_outline
      </span>
      <div className="flex-1">
        <p className="text-sm text-red-700">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-2 text-sm font-medium text-red-600 hover:text-red-700 underline"
          >
            Tentar novamente
          </button>
        )}
      </div>
    </div>
  );
}
