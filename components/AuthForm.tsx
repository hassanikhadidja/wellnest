"use client";

import Link from "next/link";
import { useState } from "react";
import { loginAccount, registerAccount } from "@/lib/dashboard-store";

type Mode = "login" | "signup";

export function AuthForm() {
  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  return (
    <div className="bg-cream/40 px-4 py-10 sm:py-14">
      <div className="mx-auto w-full max-w-md rounded-2xl border border-sand/70 bg-white p-6 shadow-[0_8px_30px_rgba(44,42,38,0.08)] sm:p-8">
        <div className="mb-6 text-center">
          <h1 className="font-display text-3xl font-semibold text-ink">
            {mode === "login" ? "Connexion" : "Créer un compte"}
          </h1>
          <p className="mt-2 text-[13px] text-muted">
            {mode === "login"
              ? "Accédez à votre espace WELLNEST."
              : "Rejoignez WELLNEST en quelques secondes."}
          </p>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-2 rounded-full bg-cream p-1">
          <button
            type="button"
            onClick={() => setMode("login")}
            className={`rounded-full py-2 text-[12px] font-bold tracking-wide transition-colors ${
              mode === "login" ? "bg-olive text-white" : "text-ink/70 hover:text-olive"
            }`}
          >
            SE CONNECTER
          </button>
          <button
            type="button"
            onClick={() => setMode("signup")}
            className={`rounded-full py-2 text-[12px] font-bold tracking-wide transition-colors ${
              mode === "signup" ? "bg-olive text-white" : "text-ink/70 hover:text-olive"
            }`}
          >
            S&apos;INSCRIRE
          </button>
        </div>

        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            void (async () => {
              setBusy(true);
              setError("");
              setMessage("");
              try {
                if (mode === "signup") {
                  await registerAccount({ name, email, password });
                  setMessage("Compte créé. Votre email apparaît dans le dashboard.");
                } else {
                  await loginAccount({ email, password });
                  setMessage("Connexion réussie.");
                }
              } catch (err) {
                setError(err instanceof Error ? err.message : "Une erreur est survenue.");
              } finally {
                setBusy(false);
              }
            })();
          }}
        >
          {mode === "signup" && (
            <label className="block">
              <span className="mb-1.5 block text-[12px] font-semibold text-ink">Nom</span>
              <input
                type="text"
                name="name"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Votre nom"
                className="w-full rounded-xl border border-sand bg-cream/40 px-4 py-3 text-[14px] text-ink outline-none placeholder:text-muted focus:border-olive focus:ring-1 focus:ring-olive/30"
              />
            </label>
          )}

          <label className="block">
            <span className="mb-1.5 block text-[12px] font-semibold text-ink">Email</span>
            <input
              type="email"
              name="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Votre adresse e-mail"
              className="w-full rounded-xl border border-sand bg-cream/40 px-4 py-3 text-[14px] text-ink outline-none placeholder:text-muted focus:border-olive focus:ring-1 focus:ring-olive/30"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-[12px] font-semibold text-ink">Mot de passe</span>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Votre mot de passe"
                className="w-full rounded-xl border border-sand bg-cream/40 px-4 py-3 pr-12 text-[14px] text-ink outline-none placeholder:text-muted focus:border-olive focus:ring-1 focus:ring-olive/30"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-muted transition-colors hover:text-olive"
                aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              >
                {showPassword ? (
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
                    <path
                      d="M3 3L21 21M10.5 10.7C10.2 11 10 11.5 10 12C10 13.1 10.9 14 12 14C12.5 14 13 13.8 13.3 13.5M9.9 5.1C10.6 4.9 11.3 4.8 12 4.8C16.5 4.8 20.2 7.8 21.5 12C21.1 13.2 20.5 14.3 19.7 15.2M6.1 6.1C4.7 7.2 3.6 8.7 3 12C4.3 16.2 8 19.2 12.5 19.2C14.1 19.2 15.6 18.8 16.9 18.1"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
                    <path
                      d="M2.5 12C3.8 7.8 7.5 4.8 12 4.8C16.5 4.8 20.2 7.8 21.5 12C20.2 16.2 16.5 19.2 12 19.2C7.5 19.2 3.8 16.2 2.5 12Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <circle cx="12" cy="12" r="3.2" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                )}
              </button>
            </div>
            {password && (
              <p className="mt-1.5 text-[11px] text-muted">
                Aperçu : <span className="font-medium text-ink">{showPassword ? password : "••••••••"}</span>
              </p>
            )}
          </label>

          {mode === "login" && (
            <div className="flex justify-end">
              <button type="button" className="text-[12px] font-semibold text-olive hover:underline">
                Mot de passe oublié ?
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-full bg-olive py-3.5 text-[12px] font-bold tracking-[0.06em] text-white transition-colors hover:bg-olive-dark disabled:opacity-60"
          >
            {busy ? "..." : mode === "login" ? "SE CONNECTER" : "CRÉER MON COMPTE"}
          </button>
          {message && <p className="text-center text-[12px] font-medium text-olive">{message}</p>}
          {error && <p className="text-center text-[12px] font-medium text-red-700">{error}</p>}
        </form>

        <p className="mt-6 text-center text-[12px] text-muted">
          <Link href="/" className="font-semibold text-olive hover:underline">
            ← Retour à l&apos;accueil
          </Link>
        </p>
      </div>
    </div>
  );
}
