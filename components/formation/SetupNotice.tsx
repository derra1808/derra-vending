interface SetupNoticeProps {
  setup: {
    supabase: boolean;
    stripe: boolean;
    ready: boolean;
  };
}

export function SetupNotice({ setup }: SetupNoticeProps) {
  return (
    <div className="formation-tip mx-auto mt-10 max-w-2xl">
      <p className="formation-label">Configuration requise</p>
      <p className="formation-title text-xl">Paiement pas encore actif</p>
      <p className="formation-body mt-3 text-sm">
        Il manque la configuration Supabase et/ou Stripe dans ton fichier <code>.env.local</code>.
      </p>
      <ul className="formation-body mt-4 space-y-2 text-sm">
        <li>{setup.supabase ? "✓" : "✗"} Supabase (compte + clés API)</li>
        <li>{setup.stripe ? "✓" : "✗"} Stripe (clé secrète + Price ID ebook)</li>
      </ul>
    </div>
  );
}
