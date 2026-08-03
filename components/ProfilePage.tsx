"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AuthForm } from "@/components/AuthForm";
import {
  AUTH_CHANGED_EVENT,
  getCurrentUser,
  getToken,
  setCurrentUser,
  type AuthUser,
} from "@/lib/api";
import {
  fetchCurrentProfile,
  logoutAccount,
  resolveNewsletterAccepted,
  upsertEmail,
} from "@/lib/dashboard-store";
import { requestEmail } from "@/lib/email-client";
import {
  getNewsletterOptIn,
  setNewsletterOptIn,
} from "@/lib/newsletter-preference";
import {
  getProgrammeRecommendation,
  type ProgrammeRecommendation,
} from "@/lib/programme-recommendation";
import { getQuestionnaireAnswers, isQuestionnaireDone } from "@/lib/questionnaire";

export function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(false);
  const [newsletter, setNewsletter] = useState(false);
  const [newsletterBusy, setNewsletterBusy] = useState(false);
  const [newsletterMsg, setNewsletterMsg] = useState("");
  const [questionnaireDone, setQuestionnaireDone] = useState(false);
  const [recommendation, setRecommendation] = useState<ProgrammeRecommendation | null>(null);

  useEffect(() => {
    let cancelled = false;

    function applyUser(current: AuthUser, accepted?: boolean) {
      setUser(current);
      const nextAccepted =
        typeof accepted === "boolean"
          ? accepted
          : typeof current.newsletterAccepted === "boolean"
            ? current.newsletterAccepted
            : getNewsletterOptIn(current.email);
      setNewsletter(nextAccepted);

      const done = isQuestionnaireDone();
      setQuestionnaireDone(done);
      if (done) {
        const answers = getQuestionnaireAnswers();
        setRecommendation(answers ? getProgrammeRecommendation(answers) : null);
      } else {
        setRecommendation(null);
      }
      setReady(true);
    }

    async function load() {
      const token = getToken();
      if (!token) {
        if (!cancelled) {
          setUser(null);
          setRecommendation(null);
          setQuestionnaireDone(false);
          setReady(true);
        }
        return;
      }

      const cached = getCurrentUser();
      if (cached) {
        if (!cancelled) applyUser(cached);
      }

      const profile = await fetchCurrentProfile();
      if (cancelled) return;

      if (profile) {
        const accepted =
          typeof profile.newsletterAccepted === "boolean"
            ? profile.newsletterAccepted
            : await resolveNewsletterAccepted(profile.email);
        if (cancelled) return;
        applyUser({ ...profile, newsletterAccepted: accepted }, accepted);
        return;
      }

      if (cached) {
        const accepted = await resolveNewsletterAccepted(cached.email);
        if (cancelled) return;
        applyUser({ ...cached, newsletterAccepted: accepted }, accepted);
        return;
      }

      setUser(null);
      setReady(true);
    }

    void load();

    const onAuth = () => {
      void load();
    };
    window.addEventListener(AUTH_CHANGED_EVENT, onAuth);
    return () => {
      cancelled = true;
      window.removeEventListener(AUTH_CHANGED_EVENT, onAuth);
    };
  }, [router]);

  async function toggleNewsletter(next: boolean) {
    if (!user || newsletterBusy) return;
    setNewsletterBusy(true);
    setNewsletterMsg("");
    try {
      await upsertEmail({
        email: user.email,
        name: user.name,
        source: "account",
        accepted: next,
      });
      if (next) {
        await requestEmail("/api/email/newsletter", {
          email: user.email,
          name: user.name,
        });
      }
      setNewsletterOptIn(user.email, next);
      setNewsletter(next);
      setCurrentUser({ ...user, newsletterAccepted: next });
      setUser({ ...user, newsletterAccepted: next });
      setNewsletterMsg(
        next
          ? "Vous êtes inscrit(e) à la newsletter."
          : "Préférence enregistrée — vous ne recevrez plus la newsletter depuis ce compte."
      );
    } catch (err) {
      setNewsletterMsg(err instanceof Error ? err.message : "Impossible de mettre à jour la newsletter.");
    } finally {
      setNewsletterBusy(false);
    }
  }

  async function handleLogout() {
    await logoutAccount();
    router.replace("/auth");
  }

  if (!ready) {
    return (
      <div className="bg-cream/40 px-4 py-16">
        <p className="text-center text-[13px] text-muted">Chargement de votre profil…</p>
      </div>
    );
  }

  if (!user) {
    return <AuthForm />;
  }

  return (
    <div className="bg-cream/40 px-4 py-10 sm:py-14">
      <div className="mx-auto w-full max-w-lg space-y-5">
        <div className="rounded-2xl border border-sand/70 bg-white p-6 shadow-[0_8px_30px_rgba(44,42,38,0.08)] sm:p-8">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-olive">Mon profil</p>
              <h1 className="font-display mt-1 text-3xl font-semibold text-ink">{user.name}</h1>
              <p className="mt-1 text-[14px] text-muted">{user.email}</p>
            </div>
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-olive/10 text-olive">
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" aria-hidden>
                <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.6" />
                <path
                  d="M5 19.5C5.8 16.2 8.5 14 12 14C15.5 14 18.2 16.2 19 19.5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>

          <dl className="mt-6 space-y-3 border-t border-sand/70 pt-5">
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-wide text-muted">Nom</dt>
              <dd className="mt-1 text-[15px] font-medium text-ink">{user.name}</dd>
            </div>
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-wide text-muted">Email</dt>
              <dd className="mt-1 text-[15px] font-medium text-ink">{user.email}</dd>
            </div>
          </dl>

          <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-xl border border-sand/70 bg-cream/40 px-4 py-3.5">
            <input
              type="checkbox"
              checked={newsletter}
              disabled={newsletterBusy}
              onChange={(e) => void toggleNewsletter(e.target.checked)}
              className="mt-0.5 h-4 w-4 accent-[#5a6b38]"
            />
            <span>
              <span className="block text-[13px] font-semibold text-ink">Recevoir la newsletter</span>
              <span className="mt-0.5 block text-[12px] leading-relaxed text-muted">
                Conseils nutrition, recettes et nouveautés WELLNEST.
              </span>
            </span>
          </label>
          {newsletterMsg && (
            <p className="mt-2 text-[12px] font-medium text-olive">{newsletterMsg}</p>
          )}

          <button
            type="button"
            onClick={() => void handleLogout()}
            className="mt-6 w-full rounded-full border border-sand py-3 text-[12px] font-bold tracking-[0.06em] text-ink/80 transition-colors hover:border-olive/40 hover:text-olive"
          >
            SE DÉCONNECTER
          </button>
        </div>

        <div className="rounded-2xl border border-sand/70 bg-white p-6 shadow-[0_8px_30px_rgba(44,42,38,0.08)] sm:p-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-olive">Programmes</p>
          {questionnaireDone && recommendation ? (
            <>
              <h2 className="font-display mt-2 text-2xl font-semibold text-ink">
                {recommendation.track.name}
              </h2>
              <p className="mt-1 text-[13px] font-medium text-olive">
                {recommendation.track.profileLabel}
              </p>
              <p className="mt-3 text-[13px] leading-relaxed text-muted">
                {recommendation.track.description}
              </p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {recommendation.track.focus.map((item) => (
                  <li
                    key={item}
                    className="rounded-full border border-olive/20 bg-cream/50 px-3 py-1 text-[11px] font-medium text-ink"
                  >
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/programmes?result=1"
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-olive px-5 py-3 text-[11px] font-bold tracking-[0.06em] text-white transition-colors hover:bg-olive-dark"
              >
                Voir les formules
                <span aria-hidden>→</span>
              </Link>
            </>
          ) : (
            <>
              <h2 className="font-display mt-2 text-2xl font-semibold text-ink">
                Pas encore de programme
              </h2>
              <p className="mt-2 text-[13px] leading-relaxed text-muted">
                Complétez le questionnaire Nutri-Profil pour découvrir le programme adapté à votre
                situation.
              </p>
              <Link
                href="/questionnaire?next=/profil"
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-olive px-5 py-3 text-[11px] font-bold tracking-[0.06em] text-white transition-colors hover:bg-olive-dark"
              >
                Faire le questionnaire
                <span aria-hidden>→</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
