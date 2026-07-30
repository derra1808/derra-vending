import { NextRequest, NextResponse } from "next/server";
import { addHoroscopeConsultation } from "@/lib/horoscope-store";
import { buildConsultationSnapshot } from "@/lib/horoscope/consultation-snapshot";
import { generateHoroscopeReport } from "@/lib/horoscope/report";
import type { BirthData } from "@/lib/horoscope/types";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      firstName?: string;
      lastName?: string;
      birthDate?: string;
      birthTime?: string;
    };

    const firstName = body.firstName?.trim();
    const lastName = body.lastName?.trim();
    const birthDate = body.birthDate?.trim();
    const birthTime = body.birthTime?.trim() || "12:00";

    if (!firstName || !lastName || !birthDate) {
      return NextResponse.json({ error: "Champs requis manquants" }, { status: 400 });
    }

    const data: BirthData = { firstName, lastName, birthDate, birthTime };
    const report = generateHoroscopeReport(data);
    const bilan = buildConsultationSnapshot(report);

    await addHoroscopeConsultation({ firstName, lastName, birthDate, birthTime, bilan });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("horoscope POST error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
