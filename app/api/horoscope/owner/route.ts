import { NextRequest, NextResponse } from "next/server";
import { getHoroscopeStats } from "@/lib/horoscope-store";
import { isOwnerProfile } from "@/lib/horoscope/owner";
import type { BirthData } from "@/lib/horoscope/types";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as BirthData;

    if (
      !body.firstName?.trim() ||
      !body.lastName?.trim() ||
      !body.birthDate?.trim() ||
      !body.birthTime?.trim()
    ) {
      return NextResponse.json({ error: "Champs requis manquants" }, { status: 400 });
    }

    const data: BirthData = {
      firstName: body.firstName.trim(),
      lastName: body.lastName.trim(),
      birthDate: body.birthDate.trim(),
      birthTime: body.birthTime.trim(),
    };

    if (!isOwnerProfile(data)) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const stats = await getHoroscopeStats();
    return NextResponse.json({ stats });
  } catch (err) {
    console.error("horoscope owner POST error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
