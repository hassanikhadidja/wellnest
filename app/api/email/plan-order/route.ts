import { NextResponse } from "next/server";
import {
  escapeHtml,
  sendAdminNotice,
} from "@/lib/mail";
import { getPlanById } from "@/lib/programmes";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      name?: string;
      phone?: string;
      email?: string;
      planId?: string;
      note?: string;
    };

    const name = String(body.name ?? "").trim();
    const phone = String(body.phone ?? "").trim();
    const email = String(body.email ?? "").trim();
    const planId = String(body.planId ?? "").trim();
    const note = String(body.note ?? "").trim();
    const plan = getPlanById(planId);

    if (!name || !phone) {
      return NextResponse.json(
        { error: "Nom et numéro de téléphone requis." },
        { status: 400 }
      );
    }
    if (!plan || plan.isFree) {
      return NextResponse.json({ error: "Formule invalide." }, { status: 400 });
    }

    const subject = `Demande formule ${plan.name} — ${name}`;
    const text = [
      "WELLNEST — Nouvelle demande de formule",
      "",
      `Nom : ${name}`,
      `Téléphone : ${phone}`,
      `Email : ${email || "—"}`,
      `Formule : ${plan.name} (${plan.duration}) — ${plan.priceLabel}`,
      `Plan ID : ${plan.id}`,
      note ? `Note : ${note}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    const html = `
      <div style="font-family:Arial,sans-serif;font-size:14px;color:#2C2A26;">
        <h2 style="color:#5A6B38;">Nouvelle demande de formule</h2>
        <table style="border-collapse:collapse;width:100%;max-width:560px;">
          <tr><td style="padding:8px 0;color:#8A857C;width:36%;">Nom</td><td style="padding:8px 0;">${escapeHtml(name)}</td></tr>
          <tr><td style="padding:8px 0;color:#8A857C;">Téléphone</td><td style="padding:8px 0;">${escapeHtml(phone)}</td></tr>
          <tr><td style="padding:8px 0;color:#8A857C;">Email</td><td style="padding:8px 0;">${escapeHtml(email || "—")}</td></tr>
          <tr><td style="padding:8px 0;color:#8A857C;">Formule</td><td style="padding:8px 0;"><strong>${escapeHtml(plan.name)}</strong> — ${escapeHtml(plan.duration)} — ${escapeHtml(plan.priceLabel)}</td></tr>
          <tr><td style="padding:8px 0;color:#8A857C;">Plan ID</td><td style="padding:8px 0;">${escapeHtml(plan.id)}</td></tr>
          ${
            note
              ? `<tr><td style="padding:8px 0;color:#8A857C;">Note</td><td style="padding:8px 0;">${escapeHtml(note)}</td></tr>`
              : ""
          }
        </table>
        <ul style="margin-top:16px;padding-left:18px;color:#555;">
          ${plan.features.map((f) => `<li>${escapeHtml(f)}</li>`).join("")}
        </ul>
      </div>
    `;

    await sendAdminNotice({ subject, html, text });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Plan order email error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Échec d'envoi." },
      { status: 500 }
    );
  }
}
