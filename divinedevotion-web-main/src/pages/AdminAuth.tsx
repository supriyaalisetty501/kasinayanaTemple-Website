import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/i18n/LanguageContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Lock } from "lucide-react";

const AdminAuth = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session) navigate("/admin/dashboard", { replace: true });
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate("/admin/dashboard", { replace: true });
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin/dashboard` },
        });
        if (error) throw error;
        toast({ title: "Account created", description: "You can now sign in." });
        setMode("signin");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Authentication failed";
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-divine px-4">
      <div className="absolute right-4 top-4">
        <LanguageSwitcher />
      </div>
      <div className="w-full max-w-md rounded-3xl border-2 border-primary/20 bg-card p-8 shadow-deep">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-saffron shadow-glow">
            <Lock className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="mt-4 font-display text-3xl font-bold text-gradient-saffron">
            {t("adminPanel")}
          </h1>
        </div>

        <form onSubmit={handle} className="mt-6 space-y-4">
          <div>
            <Label htmlFor="email">{t("email")}</Label>
            <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="h-12" />
          </div>
          <div>
            <Label htmlFor="password">{t("password")}</Label>
            <Input id="password" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="h-12" />
          </div>
          <Button type="submit" disabled={loading} className="h-12 w-full bg-gradient-saffron text-base font-semibold">
            {loading ? "..." : mode === "signin" ? t("signIn") : t("signUp")}
          </Button>
          <button
            type="button"
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="block w-full text-center text-sm text-muted-foreground hover:text-primary"
          >
            {mode === "signin" ? `→ ${t("signUp")}` : `→ ${t("signIn")}`}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          First-time setup: Sign up, then ask the project owner to grant the <code className="rounded bg-muted px-1">admin</code> role.
        </p>
      </div>
    </div>
  );
};

export default AdminAuth;
