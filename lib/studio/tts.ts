import { issueSignedToken, presignUrl, put } from "@vercel/blob";
import { getDefaultVoiceId } from "./config";

/**
 * Upload audio for Shotstack (URL publiquement téléchargeable).
 * Le store Vercel Blob du projet est en private → put private + URL signée.
 */
async function uploadAudioForRender(buffer: Buffer): Promise<string> {
  const pathname = `studio/audio/${Date.now()}.mp3`;
  const blob = await put(pathname, buffer, {
    access: "private",
    contentType: "audio/mpeg",
  });

  const validUntil = Date.now() + 1000 * 60 * 60 * 24; // 24h — suffisant pour Shotstack
  const signed = await issueSignedToken({
    pathname: blob.pathname,
    operations: ["get"],
    validUntil,
  });
  const { presignedUrl } = await presignUrl(signed, {
    access: "private",
    operation: "get",
    pathname: blob.pathname,
    validUntil,
  });

  return presignedUrl;
}

export async function synthesizeSpeech(
  text: string,
  voiceId?: string | null
): Promise<{ audioUrl: string; durationEstimateSec: number }> {
  const key = process.env.ELEVENLABS_API_KEY;
  if (!key) {
    throw new Error(
      "ELEVENLABS_API_KEY manquant — crée un compte sur elevenlabs.io"
    );
  }

  const voice = voiceId || getDefaultVoiceId();
  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voice}?output_format=mp3_44100_128`,
    {
      method: "POST",
      headers: {
        "xi-api-key": key,
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
      },
      body: JSON.stringify({
        text,
        model_id: process.env.ELEVENLABS_MODEL || "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.45,
          similarity_boost: 0.75,
          style: 0.2,
          use_speaker_boost: true,
        },
      }),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`ElevenLabs erreur ${res.status}: ${err.slice(0, 300)}`);
  }

  const buffer = Buffer.from(await res.arrayBuffer());
  let audioUrl: string;
  try {
    audioUrl = await uploadAudioForRender(buffer);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(
      `Vercel Blob: ${message}. Si le store est private, le code utilise une URL signée. Sinon crée un store Blob public dans Vercel.`
    );
  }

  const words = text.trim().split(/\s+/).length;
  const durationEstimateSec = Math.max(28, Math.min(58, words / 2.4 + 2));

  return { audioUrl, durationEstimateSec };
}
