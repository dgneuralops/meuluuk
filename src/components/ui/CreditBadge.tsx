"use client";

import { useState, useEffect } from "react";
import { getUserCredits } from "@/lib/actions";

interface CreditBadgeProps {
  className?: string;
}

export function CreditBadge({ className = "" }: CreditBadgeProps) {
  const [credits, setCredits] = useState<number | null>(null);

  useEffect(() => {
    getUserCredits().then((result) => {
      if (result.success) {
        setCredits(result.credits.credits_remaining);
      }
    });
  }, []);

  if (credits === null) return null;

  return (
    <div
      className={`
        inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold
        ${credits > 0
          ? "bg-primary/10 text-primary"
          : "bg-red-50 text-red-500"
        }
        ${className}
      `}
    >
      <span className="material-icons-outlined text-sm">
        {credits > 0 ? "bolt" : "bolt_off"}
      </span>
      {credits}
    </div>
  );
}
