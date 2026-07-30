"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import type { ProductType } from "@/lib/stripe";

interface CheckoutButtonProps {
  product: ProductType;
  label?: string;
  className?: string;
  requireAuth?: boolean;
}

export function CheckoutButton({
  product,
  label = "Acheter maintenant",
  className = "",
  requireAuth = true,
}: CheckoutButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCheckout() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product }),
      });

      const data = await res.json();

      if (res.status === 401 && requireAuth) {
        router.push(`/formation/signup?redirect=/formation/pricing&product=${product}`);
        return;
      }

      if (!res.ok) {
        throw new Error(data.error || "Erreur lors du paiement");
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleCheckout}
        disabled={loading}
        className={
          className ||
          "formation-btn-primary flex w-full items-center justify-center gap-2 disabled:opacity-60"
        }
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {label}
      </button>
      {error && (
        <p
          className="formation-body mt-3 text-center text-xs leading-relaxed"
          style={{ color: "var(--d-gold)" }}
        >
          {error}
        </p>
      )}
    </div>
  );
}
