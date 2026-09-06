import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSetupStatus } from "@/lib/formation/config";
import { getStripe, getPriceId, type ProductType } from "@/lib/stripe";
import { FORMATION } from "@/lib/formation/content";

export async function POST(request: Request) {
  try {
    const setup = getSetupStatus();

    if (!setup.supabase) {
      return NextResponse.json(
        {
          error:
            "Supabase n'est pas configuré. Ajoutez NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY dans .env.local",
        },
        { status: 503 }
      );
    }

    if (!setup.stripe) {
      return NextResponse.json(
        {
          error:
            "Stripe n'est pas configuré. Ajoutez STRIPE_SECRET_KEY et STRIPE_PRICE_EBOOK dans .env.local",
        },
        { status: 503 }
      );
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Connectez-vous pour acheter" },
        { status: 401 }
      );
    }

    const { product } = (await request.json()) as { product: ProductType };

    if (!["ebook", "coaching_call", "coaching_full"].includes(product)) {
      return NextResponse.json({ error: "Produit invalide" }, { status: 400 });
    }

    const stripe = getStripe();
    const origin =
      request.headers.get("origin") ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      "http://localhost:3000";

    const lineItems =
      product === "ebook"
        ? [
            {
              price_data: {
                currency: "chf",
                unit_amount: FORMATION.ebookPrice * 100,
                product_data: {
                  name: "Pack méthode — Le Café en Dépôt Gratuit",
                  description: "Ebook, bonus, audio, vidéos, 50 Q/R — accès membre.",
                },
              },
              quantity: 1,
            },
          ]
        : product === "coaching_call"
          ? [
              {
                price_data: {
                  currency: "chf",
                  unit_amount: FORMATION.coachingCallPrice * 100,
                  product_data: {
                    name: "Appel Q&R + fournisseurs — Derra Vending",
                    description:
                      "1 heure avec Ibrahim + accès à ses contacts fournisseurs.",
                  },
                },
                quantity: 1,
              },
            ]
          : [{ price: getPriceId(product), quantity: 1 }];

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: lineItems,
      success_url: `${origin}/formation/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/formation/cancel`,
      customer_email: user.email,
      client_reference_id: user.id,
      metadata: {
        user_id: user.id,
        product,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error && error.message.includes("Invalid API Key")
            ? "Clé Stripe invalide. Copie une nouvelle clé secrète (sk_test_ ou sk_live_) dans .env.local — même mode que ton produit."
            : error instanceof Error
              ? error.message
              : "Erreur checkout",
      },
      { status: 500 }
    );
  }
}
