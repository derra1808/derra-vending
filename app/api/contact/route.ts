import { NextRequest, NextResponse } from "next/server";
import { addContactLead } from "@/lib/contact-store";

async function notifyByEmail(lead: {
  type: string;
  name: string;
  phone: string;
  email: string;
  company: string;
  message: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_NOTIFY_EMAIL || "derra_vending@hotmail.com";
  if (!apiKey) return;

  const typeLabel = lead.type === "visit" ? "Visite gratuite" : "Être rappelé";
  const body = [
    `Type: ${typeLabel}`,
    `Nom: ${lead.name}`,
    `Téléphone: ${lead.phone}`,
    `Email: ${lead.email}`,
    `Lieu: ${lead.company || "—"}`,
    "",
    lead.message,
  ].join("\n");

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.RESEND_FROM || "Derra Vending <onboarding@resend.dev>",
      to: [to],
      reply_to: lead.email,
      subject: `${typeLabel} — ${lead.name} (Derra Vending)`,
      text: body,
    }),
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      type?: string;
      name?: string;
      phone?: string;
      email?: string;
      company?: string;
      message?: string;
    };

    const name = body.name?.trim();
    const phone = body.phone?.trim();
    const email = body.email?.trim();
    const message = body.message?.trim();
    const type = body.type === "callback" ? "callback" : "visit";
    const company = body.company?.trim() || "";

    if (!name || !phone || !email || !message) {
      return NextResponse.json({ error: "Champs requis manquants" }, { status: 400 });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Email invalide" }, { status: 400 });
    }

    const lead = await addContactLead({ type, name, phone, email, company, message });

    try {
      await notifyByEmail({ type, name, phone, email, company, message });
    } catch (err) {
      console.error("contact email notify:", err);
    }

    return NextResponse.json({ ok: true, id: lead.at });
  } catch (err) {
    console.error("contact POST error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
