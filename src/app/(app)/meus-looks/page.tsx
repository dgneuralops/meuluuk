"use client";

import { useLooks } from "@/hooks/useLooks";
import { LookGallery } from "@/components/looks/LookGallery";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { APP_NAME } from "@/lib/utils/constants";

export default function MeusLooksPage() {
  const router = useRouter();
  const { looks, loading, error, handleDelete, handleToggleFavorite } = useLooks();

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1
            className="text-3xl font-bold"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Meus Looks
          </h1>
          <p className="text-sm text-muted mt-1">
            {looks.length === 0
              ? "Nenhum look salvo ainda"
              : `${looks.length} ${looks.length === 1 ? "look salvo" : "looks salvos"}`}
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={() => router.push("/pecas")}>
          <span className="material-icons-outlined text-base mr-1">add</span>
          Novo look
        </Button>
      </div>

      {error && (
        <p className="text-sm text-red-500 text-center mb-4">{error}</p>
      )}

      <LookGallery
        looks={looks}
        loading={loading}
        onDelete={handleDelete}
        onToggleFavorite={handleToggleFavorite}
      />
    </div>
  );
}
