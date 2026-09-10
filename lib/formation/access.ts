/** Un paiement ebook (1 CHF, 47 CHF, ou autre) = accès à vie. Le prix actuel ne compte plus. */
export function hasLifetimeFormationAccess(
  user?: { user_metadata?: Record<string, unknown> | null } | null,
  profile?: { has_paid?: boolean | null } | null
) {
  return user?.user_metadata?.has_paid === true || profile?.has_paid === true;
}
