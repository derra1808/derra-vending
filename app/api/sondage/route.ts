import { NextRequest, NextResponse } from "next/server";
import { getMachine, getValidChoices, type SandwichId } from "@/lib/surveys";
import { addVote, getAllStats, getStats } from "@/lib/survey-store";

function isAuthorized(request: NextRequest) {
  const expected = process.env.SURVEY_ADMIN_PASSWORD;
  if (!expected) return false;
  const header = request.headers.get("authorization");
  const bearer = header?.startsWith("Bearer ") ? header.slice(7) : null;
  const query = request.nextUrl.searchParams.get("key");
  return bearer === expected || query === expected;
}

export async function GET(request: NextRequest) {
  const machineId = request.nextUrl.searchParams.get("machine");
  const admin = request.nextUrl.searchParams.get("admin") === "1";

  if (admin) {
    if (!isAuthorized(request)) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }
    const stats = await getAllStats();
    return NextResponse.json({ stats });
  }

  if (!machineId) {
    return NextResponse.json({ error: "machine requis" }, { status: 400 });
  }

  if (!getMachine(machineId)) {
    return NextResponse.json({ error: "Machine inconnue" }, { status: 404 });
  }

  const stats = await getStats(machineId);
  return NextResponse.json({ machineId, stats });
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { machine?: string; choice?: string };
    const machineId = body.machine;
    const choice = body.choice as SandwichId;

    if (!machineId || !choice) {
      return NextResponse.json({ error: "machine et choice requis" }, { status: 400 });
    }

    if (!getMachine(machineId)) {
      return NextResponse.json({ error: "Machine inconnue" }, { status: 404 });
    }

    if (!getValidChoices(machineId).includes(choice)) {
      return NextResponse.json({ error: "Choix invalide" }, { status: 400 });
    }

    const stats = await addVote(machineId, choice);
    return NextResponse.json({ ok: true, stats });
  } catch (err) {
    console.error("sondage POST error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
