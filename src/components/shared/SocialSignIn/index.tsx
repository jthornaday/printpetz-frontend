import { useRef, useState } from "react";
import { GoogleIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { useSignInWithProviderMutation } from "@/store/api/authApi";
import { useToast } from "@/hooks/useToast";
import { EToastType } from "@/types/toast";

type ProviderName = "google" | "facebook" | "apple";
const providers: { id: ProviderName; label: string; enabled: boolean }[] = [
  { id: "google", label: "Continue with Google", enabled: true },
  { id: "facebook", label: "Continue with Facebook", enabled: process.env.NEXT_PUBLIC_ENABLE_FACEBOOK_LOGIN === "true" },
  { id: "apple", label: "Continue with Apple", enabled: process.env.NEXT_PUBLIC_ENABLE_APPLE_LOGIN === "true" },
];

function ProviderIcon({ provider }: { provider: ProviderName }) {
  if (provider === "google") return <GoogleIcon size={19}/>;
  if (provider === "facebook") return <svg aria-hidden="true" width="19" height="19" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12a12 12 0 1 0-13.875 11.855V15.47H7.078V12h3.047V9.356c0-3.008 1.792-4.669 4.533-4.669 1.313 0 2.686.235 2.686.235v2.953h-1.513c-1.491 0-1.956.925-1.956 1.874V12h3.328l-.532 3.47h-2.796v8.385A12.003 12.003 0 0 0 24 12Z"/></svg>;
  return <svg aria-hidden="true" width="19" height="19" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 12.54c.03 3.27 2.87 4.36 2.9 4.38-.02.08-.45 1.56-1.49 3.09-.9 1.32-1.83 2.63-3.3 2.66-1.44.03-1.91-.86-3.56-.86-1.65 0-2.17.83-3.53.89-1.42.05-2.5-1.42-3.41-2.73-1.85-2.68-3.26-7.56-1.37-10.86A5.29 5.29 0 0 1 7.77 6.4c1.4-.03 2.73.95 3.59.95.86 0 2.47-1.18 4.16-1.01.71.03 2.68.29 3.95 2.15-.1.06-2.36 1.37-2.42 4.05ZM14.4 4.56c.76-.92 1.28-2.2 1.14-3.48-1.1.04-2.44.74-3.23 1.66-.71.82-1.33 2.13-1.16 3.38 1.23.1 2.49-.63 3.25-1.56Z"/></svg>;
}

export function SocialSignIn({ disabled, onBusyChange }: { disabled: boolean; onBusyChange: (busy: boolean) => void }) {
  const [signIn] = useSignInWithProviderMutation();
  const [pending, setPending] = useState<ProviderName | null>(null);
  const submitting = useRef(false);
  const { toast } = useToast();
  const start = async (provider: ProviderName) => {
    if (disabled || submitting.current) return;
    submitting.current = true;
    setPending(provider);
    onBusyChange(true);
    try {
      const result = await signIn({ provider, queryParams: provider === "google" ? { prompt: "select_account" } : undefined });
      if (result.error) toast(EToastType.ERROR, "We couldn’t start that sign-in. Please try again or use another option.");
    } catch {
      toast(EToastType.ERROR, "Sign-in could not connect. Please try again.");
    } finally {
      submitting.current = false;
      setPending(null);
      onBusyChange(false);
    }
  };
  return <div className="flex flex-col gap-3" aria-label="Social sign-in options">{providers.filter(p => p.enabled).map(p => <Button key={p.id} type="button" variant="outline" className={p.id === "apple" ? "h-12 bg-black text-white hover:bg-black/90 hover:border-black" : "h-12"} disabled={disabled || pending !== null} loading={pending === p.id} onClick={() => start(p.id)}><ProviderIcon provider={p.id}/>{p.label}</Button>)}</div>;
}
