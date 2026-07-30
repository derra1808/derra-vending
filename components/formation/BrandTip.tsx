interface BrandTipProps {
  label?: string;
  title: string;
  children: React.ReactNode;
}

/** Encadré type palette — « L'ASTUCE » */
export function BrandTip({ label = "L'astuce", title, children }: BrandTipProps) {
  return (
    <aside className="formation-tip">
      <p className="formation-label">{label}</p>
      <h3 className="formation-title">{title}</h3>
      <div className="formation-body">{children}</div>
    </aside>
  );
}
