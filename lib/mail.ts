import { readFile } from "fs/promises";
import path from "path";
import nodemailer from "nodemailer";

export const ADMIN_EMAIL = "wellnest.diet@gmail.com";
const SITE_URL = "https://wellnest-i92h.vercel.app/";

export type MailTemplateId =
  | "newsletter-welcome"
  | "newsletter-notify"
  | "questionnaire-confirm"
  | "questionnaire-notify"
  | "ebook-delivery";

type TemplateParams = Record<string, string>;

const TEMPLATE_FILES: Record<MailTemplateId, string> = {
  "newsletter-welcome": "1-newsletter-welcome.html",
  "newsletter-notify": "2-newsletter-notify.html",
  "questionnaire-confirm": "3-questionnaire-confirm.html",
  "questionnaire-notify": "4-questionnaire-notify.html",
  "ebook-delivery": "5-ebook-delivery.html",
};

const TEMPLATE_SUBJECTS: Record<MailTemplateId, (params: TemplateParams) => string> = {
  "newsletter-welcome": () => "Confirmation de votre inscription WELLNEST",
  "newsletter-notify": () => "Nouvelle inscription newsletter WELLNEST",
  "questionnaire-confirm": () => "Confirmation de réception — questionnaire WELLNEST",
  "questionnaire-notify": (params) =>
    `Nouveau questionnaire — ${params.first_name ?? ""} ${params.last_name ?? ""}`.trim(),
  "ebook-delivery": (params) =>
    `Lien de téléchargement — ${params.ebook_title ?? "e-book WELLNEST"}`,
};

function requiredEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

function getTransporter() {
  const user = requiredEnv("GMAIL_USER");
  // App passwords are often pasted with spaces; Gmail accepts them without.
  const pass = requiredEnv("GMAIL_APP_PASSWORD").replace(/\s+/g, "");

  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user, pass },
  });
}

async function loadTemplateHtml(templateId: MailTemplateId): Promise<string> {
  const fileName = TEMPLATE_FILES[templateId];
  const filePath = path.join(process.cwd(), "email templates", fileName);
  return readFile(filePath, "utf8");
}

function renderTemplate(html: string, params: TemplateParams): string {
  let output = html;

  // Unescaped HTML (triple braces), e.g. {{{answers_html}}}
  output = output.replace(/\{\{\{\s*([\w.]+)\s*\}\}\}/g, (_match, key: string) => {
    return params[key] ?? "";
  });

  // Escaped / plain text variables {{name}}
  output = output.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (_match, key: string) => {
    return params[key] ?? "";
  });

  return output;
}

function htmlToText(html: string): string {
  return html
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<\/tr>/gi, "\n")
    .replace(/<\/h[1-6]>/gi, "\n\n")
    .replace(/<a[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi, "$2 ($1)")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function buildTextFallback(
  templateId: MailTemplateId,
  params: TemplateParams
): string {
  switch (templateId) {
    case "newsletter-welcome":
      return [
        "WELLNEST — Confirmation d'inscription",
        "",
        "Merci de nous rejoindre.",
        `Votre inscription à la newsletter est confirmée (${params.to_email ?? ""}).`,
        "Vous recevrez bientôt des conseils nutrition adaptés à chaque étape de la vie.",
        "",
        `Site : ${SITE_URL}`,
        "Contact : wellnest.diet@gmail.com",
        "WELLNEST — Alger, Algérie",
        "",
        "Pour vous désinscrire, répondez à cet e-mail avec le mot DESABONNER.",
      ].join("\n");
    case "newsletter-notify":
      return [
        "WELLNEST — Nouvelle inscription newsletter",
        `Email : ${params.subscriber_email ?? ""}`,
        `Source : ${params.source ?? ""}`,
      ].join("\n");
    case "questionnaire-confirm":
      return [
        "WELLNEST — Questionnaire reçu",
        "",
        `Bonjour ${params.first_name ?? ""},`,
        "Nous avons bien reçu votre questionnaire.",
        `Nous vous recontactons bientôt à ${params.to_email ?? ""}.`,
        "",
        `Site : ${SITE_URL}`,
        "Contact : wellnest.diet@gmail.com · +213 555 58 91 18",
      ].join("\n");
    case "questionnaire-notify":
      return [
        "WELLNEST — Nouveau questionnaire",
        `${params.first_name ?? ""} ${params.last_name ?? ""}`,
        `${params.email ?? ""} · ${params.phone ?? ""}`,
        "",
        htmlToText(params.answers_html ?? ""),
      ].join("\n");
    case "ebook-delivery":
      return [
        "WELLNEST — Votre e-book",
        "",
        `Voici votre accès à : ${params.ebook_title ?? ""}`,
        `Télécharger : ${params.download_url ?? ""}`,
        "",
        "Contact : wellnest.diet@gmail.com · +213 555 58 91 18",
      ].join("\n");
  }
}

export async function sendTemplateEmail(options: {
  templateId: MailTemplateId;
  to: string;
  params?: TemplateParams;
}): Promise<void> {
  const params = options.params ?? {};
  const fromUser = requiredEnv("GMAIL_USER");
  const html = renderTemplate(await loadTemplateHtml(options.templateId), params);
  const subject = TEMPLATE_SUBJECTS[options.templateId](params);
  const text = buildTextFallback(options.templateId, params);
  const transporter = getTransporter();

  const isNewsletter = options.templateId === "newsletter-welcome";
  const headers: Record<string, string> = {
    "X-Mailer": "WELLNEST",
  };

  if (isNewsletter) {
    headers["List-Unsubscribe"] = `<mailto:${fromUser}?subject=DESABONNER>, <${SITE_URL}>`;
    headers["List-Unsubscribe-Post"] = "List-Unsubscribe=One-Click";
  }

  await transporter.sendMail({
    from: `"WELLNEST" <${fromUser}>`,
    replyTo: fromUser,
    to: options.to,
    subject,
    text,
    html,
    headers,
  });
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
