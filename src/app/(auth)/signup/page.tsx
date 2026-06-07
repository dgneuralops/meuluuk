"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { APP_NAME, APP_TAGLINE } from "@/lib/utils/constants";
import Link from "next/link";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
          emailRedirectTo: `${window.location.origin}/pecas`,
        },
      });

      if (error) {
        setError(error.message);
      } else {
        setSent(true);
      }
    } catch (err: any) {
      setError(err.message || "Erro ao criar conta");
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
            Criar conta
          </h2>
          <p className="text-sm text-muted mb-6">
            Comece a experimentar looks virtuais
          </p>

          {sent ? (
            <div className="text-center py-6">
              <span className="material-icons-outlined text-5xl text-green-500 mb-3">
                mark_email_read
              </span>
              <p className="text-base text-foreground font-semibold">
                Verifique seu e-mail!
              </p>
              <p className="text-xs text-muted mt-2">
                Enviamos um link de confirmação.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-foreground mb-1.5"
                >
                  Nome
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                  placeholder="Seu nome"
                />
              </div>

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
                  minLength={6}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                  placeholder="Mínimo 6 caracteres"
                />
              </div>

              {error && (
                <p className="text-sm text-red-500">{error}</p>
              )}

              <Button type="submit" loading={loading} className="w-full">
                Criar conta
              </Button>

              <div className="bg-surface rounded-xl p-3 border border-border mt-2">
                <p className="text-xs text-muted flex items-center gap-1.5">
                  <span className="material-icons-outlined text-sm text-primary">bolt</span>
                  Você recebe 5 créditos gratuitos para experimentar o provador virtual.
                </p>
              </div>
            </form>
          )}

          <p className="text-xs text-center text-muted mt-6">
            Já tem conta?{" "}
            <Link
              href="/login"
              className="text-primary font-semibold hover:underline"
            >
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
