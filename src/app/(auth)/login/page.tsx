"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { APP_NAME, APP_TAGLINE } from "@/lib/utils/constants";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const router = useRouter();
  const supabase = createClient();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      router.push("/pecas");
    }

    setLoading(false);
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/pecas`,
      },
    });

    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-peach dark:bg-background">
      <div className="w-full max-w-sm animate-fade-in">
        <div className="text-center mb-10">
          <h1
            className="text-4xl font-bold tracking-tight"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {APP_NAME}
          </h1>
          <p className="text-sm text-muted mt-2">{APP_TAGLINE}</p>
        </div>

        <div className="bg-surface-elevated rounded-2xl p-6 shadow-sm border border-border">
          <h2 className="text-xl font-semibold mb-1" style={{ fontFamily: "var(--font-playfair)" }}>
            Entrar
          </h2>
          <p className="text-sm text-muted mb-6">
            Acesse sua conta para continuar
          </p>

          {sent ? (
            <div className="text-center py-6">
              <span className="material-icons-outlined text-5xl text-green-500 mb-3">
                mark_email_read
              </span>
              <p className="text-base text-foreground font-semibold">
                Link enviado!
              </p>
              <p className="text-xs text-muted mt-2">
                Verifique seu e-mail para acessar.
              </p>
            </div>
          ) : (
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-foreground mb-1.5"
                >
                  E-mail
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                  placeholder="seu@email.com"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-foreground mb-1.5"
                >
                  Senha
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                  placeholder="••••••••"
                />
              </div>

              {error && (
                <p className="text-sm text-red-500">{error}</p>
              )}

              <Button type="submit" loading={loading} className="w-full">
                Entrar
              </Button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-3 text-muted bg-surface-elevated">ou</span>
                </div>
              </div>

              <Button
                type="button"
                variant="secondary"
                onClick={handleMagicLink}
                loading={loading}
                disabled={!email}
                className="w-full"
              >
                Enviar link mágico
              </Button>
            </form>
          )}

          <p className="text-xs text-center text-muted mt-6">
            Não tem conta?{" "}
            <Link
              href="/signup"
              className="text-primary font-semibold hover:underline"
            >
              Criar conta
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
