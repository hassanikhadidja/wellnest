import { NextResponse } from "next/server";
import { getApiBase } from "@/lib/api";
import { isValidEmail, sendTemplateEmail } from "@/lib/mail";
import { getEbookById } from "@/lib/ebooks";

type EbookApiRow = {
  id?: string;
  title?: string;
  pdfUrl?: string;
};

async function resolveEbookDelivery(ebookId: string): Promise<{
  title: string;
  downloadUrl: string;
} | null> {
  try {
    const res = await fetch(`${getApiBase()}/ebook/${ebookId}`, {
      cache: "no-store",
    });
    if (res.ok) {
      const data = (await res.json()) as EbookApiRow;
      if (data?.pdfUrl?.trim()) {
        return {
          title: data.title?.trim() || "E-book WELLNEST",
          downloadUrl: data.pdfUrl.trim(),
        };
      }
    }
  } catch {
    // fall through to static catalog
  }

  const local = getEbookById(ebookId);
  if (!local) return null;

  // Static demo ebooks have no PDF URL yet.
  return null;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      email?: string;
      ebookId?: string;
    };

    const email = body.email?.trim() ?? "";
    const ebookId = body.ebookId?.trim() ?? "";

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Email invalide." }, { status: 400 });
    }
    if (!ebookId) {
      return NextResponse.json({ error: "E-book manquant." }, { status: 400 });
    }

    const ebook = await resolveEbookDelivery(ebookId);
    if (!ebook) {
      return NextResponse.json(
        {
          error:
            "Aucun fichier PDF n'est disponible pour cet e-book. Ajoutez un PDF depuis le dashboard.",
        },
        { status: 404 }
      );
    }

    await sendTemplateEmail({
      templateId: "ebook-delivery",
      to: email,
      params: {
        to_email: email,
        ebook_title: ebook.title,
        download_url: ebook.downloadUrl,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Ebook email error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Échec d'envoi." },
      { status: 500 }
    );
  }
}
