import { AuthForm } from "@/components/formation/AuthForm";
import { SetupNotice } from "@/components/formation/SetupNotice";
import { getSetupStatus } from "@/lib/formation/config";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string; product?: string }>;
}) {
  const params = await searchParams;
  const redirectTo = params.redirect || "/formation/pricing";
  const setup = getSetupStatus();

  return (
    <div className="section-night flex min-h-[60vh] items-center justify-center px-6 py-24">
      <div className="w-full max-w-md">
        <p className="formation-label">Espace membre</p>
        <h1 className="formation-title mt-4 text-3xl">Inscription</h1>
        {!setup.supabase && (
          <div className="mt-6">
            <SetupNotice setup={setup} />
          </div>
        )}
        <div className="mt-10">
          <AuthForm mode="signup" redirectTo={redirectTo} />
        </div>
      </div>
    </div>
  );
}
