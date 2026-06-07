"use client";

import { useState, useCallback, useEffect } from "react";
import { getSavedLooks, deleteSavedLook, toggleFavorite } from "@/lib/actions";
import type { SavedLook } from "@/types";

interface UseLooksReturn {
  looks: SavedLook[];
  loading: boolean;
  error: string | null;
  fetchLooks: () => Promise<void>;
  handleDelete: (id: string) => Promise<void>;
  handleToggleFavorite: (id: string) => Promise<void>;
}

export function useLooks(): UseLooksReturn {
  const [looks, setLooks] = useState<SavedLook[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLooks = useCallback(async () => {
    setLoading(true);
    setError(null);

    const result = await getSavedLooks();

    if (!result.success) {
      setError(result.error);
    } else {
      setLooks(result.looks);
    }

    setLoading(false);
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    const result = await deleteSavedLook(id);
    if (result.success) {
      setLooks((prev) => prev.filter((l) => l.id !== id));
    }
  }, []);

  const handleToggleFavorite = useCallback(async (id: string) => {
    const result = await toggleFavorite(id);
    if (result.success) {
      setLooks((prev) =>
        prev.map((l) => (l.id === id ? { ...l, favorite: result.savedLook.favorite } : l))
      );
    }
  }, []);

  useEffect(() => {
    fetchLooks();
  }, [fetchLooks]);

  return { looks, loading, error, fetchLooks, handleDelete, handleToggleFavorite };
}
