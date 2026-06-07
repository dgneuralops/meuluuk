"use client";

import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { Button } from "@/components/ui/Button";

interface ResultErrorProps {
  message: string;
  onRetry: () => void;
  onBack: () => void;
}

export function ResultError({ message, onRetry, onBack }: ResultErrorProps) {
  return (
    <div className="flex flex-col items-center gap-6 py-12 animate-fade-in">
      <span className="material-icons-outlined text-6xl text-red-300">
        image_not_supported
      </span>
      <div className="text-center">
        <h3 className="text-lg font-semibold text-foreground mb-1">
          Não foi possível gerar o look
        </h3>
        <p className="text-sm text-muted max-w-xs">
          Verifique se a foto está clara e as peças são visíveis.
        </p>
      </div>
      <ErrorBanner message={message} className="w-full max-w-sm" />
      <div className="flex flex-col gap-3 w-full max-w-sm">
        <Button variant="primary" onClick={onRetry} className="w-full">
          <span className="material-icons-outlined text-base mr-1">refresh</span>
          Tentar novamente
        </Button>
        <Button variant="ghost" onClick={onBack} className="w-full">
          Voltar
        </Button>
      </div>
    </div>
  );
}
