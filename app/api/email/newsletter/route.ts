import { NextResponse } from "next/server";
import {
  ADMIN_EMAIL,
  isValidEmail,
  sendTemplateEmail,
} from "@/lib/mail";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      email?: string;
      source?: string;
    };

    const email = body.email?.trim() ?? "";
    const source = body.source?.trim() || "newsletter";

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Email invalide." }, { status: 400 });
    }

    await Promise.all([
      sendTemplateEmail({
        templateId: "newsletter-welcome",
        to: email,
        params: { to_email: email, email },
      }),
      sendTemplateEmail({
        templateId: "newsletter-notify",
        to: ADMIN_EMAIL,
        params: {
          to_email: ADMIN_EMAIL,
          subscriber_email: email,
          source,
        },
      }),
    ]);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Newsletter email error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Échec d'envoi." },
      { status: 500 }
    );
  }
}
