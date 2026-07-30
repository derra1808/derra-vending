/** Thème apaisant — blanc, sage & lavande */
export const hz = {
  title: "text-peace-text",
  text: "text-peace-text/85",
  muted: "text-peace-muted",
  accent: "text-peace-sage",
  accentSoft: "text-peace-sage-dark",
  accentLavender: "text-peace-lavender-deep",
  period: "text-peace-sage-dark",

  card: "rounded-2xl border border-peace-200/80 bg-white/90 shadow-peace backdrop-blur-sm",
  cardInner: "rounded-xl border border-peace-150 bg-peace-50/80",
  cardHighlight: "rounded-xl border border-peace-sage/25 bg-peace-100/60",
  cardLavender: "rounded-xl border border-peace-lavender/30 bg-peace-lavender/40",
  cardHero: "rounded-2xl border border-peace-sage/20 bg-gradient-to-br from-peace-100/80 to-peace-lavender/30",

  input:
    "w-full rounded-xl border border-peace-200 bg-white/90 px-4 py-3.5 text-base text-peace-text placeholder:text-peace-muted/50 outline-none transition focus:border-peace-sage/50 focus:bg-white focus:ring-2 focus:ring-peace-sage/15",
  legend: "text-xs font-semibold uppercase tracking-wider text-peace-sage-dark",
  label: "text-sm font-medium text-peace-text/80",

  btnPrimary:
    "rounded-xl bg-peace-sage px-6 py-4 text-base font-semibold text-white shadow-peace transition hover:bg-peace-sage-dark disabled:opacity-60",
  btnGhost:
    "rounded-lg border border-peace-200 bg-white/60 px-4 py-2 text-sm text-peace-muted transition hover:border-peace-sage/40 hover:bg-peace-50 hover:text-peace-sage-dark",

  nav: "sticky top-0 z-20 border-b border-peace-200/60 bg-white/80 backdrop-blur-lg md:rounded-2xl md:border md:shadow-peace",
  tabActive: "bg-peace-100 text-peace-sage-dark ring-1 ring-peace-sage/25",
  tabInactive: "text-peace-muted hover:bg-peace-50 hover:text-peace-text",

  number: "font-bold text-peace-sage-dark",
  badge: "rounded-full bg-peace-100 px-2 py-0.5 text-xs font-medium text-peace-sage-dark",
  dot: "h-1.5 w-1.5 shrink-0 rounded-full bg-peace-sage",
  dotMuted: "h-1.5 w-1.5 shrink-0 rounded-full bg-peace-muted/50",
  iconBox: "rounded-2xl border border-peace-sage/20 bg-peace-100/50 text-peace-sage-dark",
  divider: "border-peace-150",
  tableHead: "bg-peace-50 text-peace-muted",
  tableRowActive: "bg-peace-100/70",
  warn: "border-peace-coral/30 bg-peace-coral/10 text-peace-coral-dark",
  warnNumber: "text-peace-coral-dark",
} as const;
