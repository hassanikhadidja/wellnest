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
      name?: string;
    };

    const email = body.email?.trim() ?? "";
    const name = body.name?.trim() || "Utilisateur";

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Email invalide." }, { status: 400 });
    }

    await Promise.all([
      sendTemplateEmail({
        templateId: "account-welcome",
        to: email,
        params: {
          to_email: email,
          email,
          user_name: name,
        },
      }),
      sendTemplateEmail({
        templateId: "account-notify",
        to: ADMIN_EMAIL,
        params: {
          to_email: ADMIN_EMAIL,
          user_name: name,
          user_email: email,
        },
      }),
    ]);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Account email error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Échec d'envoi." },
      { status: 500 }
    );
  }
}
