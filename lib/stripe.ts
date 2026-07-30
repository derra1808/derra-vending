import Stripe from "stripe";

let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY manquante dans .env.local");
  }
  if (!stripeInstance) {
    stripeInstance = new Stripe(key);
  }
  return stripeInstance;
}

export type ProductType = "ebook" | "coaching_call" | "coaching_full";

export function getPriceId(product: ProductType): string {
  const map: Record<ProductType, string | undefined> = {
    ebook: process.env.STRIPE_PRICE_EBOOK,
    coaching_call: process.env.STRIPE_PRICE_COACHING_CALL,
    coaching_full: process.env.STRIPE_PRICE_COACHING_FULL,
  };
  const priceId = map[product];
  if (!priceId) throw new Error(`Price ID manquant pour: ${product}`);
  return priceId;
}
