import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import authImg from "@/assets/auth.jpg";
import { api, auth } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowLeft, Loader2 } from "lucide-react";

const searchSchema = z.object({
  mode: z.enum(["login", "signup"]).optional(),
});

export const Route = createFileRoute("/auth")({
  validateSearch: searchSchema,
  component: AuthPage,
});

function AuthPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">(search.mode ?? "login");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
    weight: "",
  });

  function update<K extends keyof typeof form>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        await api.signup({
          name: form.name,
          email: form.email,
          password: form.password,
          age: Number(form.age),
          weight: Number(form.weight),
        });
        toast.success("Account created. Welcome to the program.");
      }
      const res = await api.login({ email: form.email, password: form.password });
      if (!res?.token) throw new Error("No token returned");
      auth.setToken(res.token);
      auth.setUser({
        name: res.user?.name ?? res.name ?? form.name ?? form.email.split("@")[0],
        email: form.email,
      });
      navigate({ to: "/dashboard" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-screen bg-background lg:grid-cols-2">
      {/* Form */}
      <div className="relative flex flex-col px-6 py-10 md:px-16">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>

        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center">
          <p className="mb-3 text-xs uppercase tracking-[0.4em] text-primary/80">
            {mode === "signup" ? "Enlist" : "Return"}
          </p>
          <h1 className="font-display text-5xl">
            {mode === "signup" ? (
              <>
                Begin the <span className="text-gold italic">ritual.</span>
              </>
            ) : (
              <>
                Welcome <span className="text-gold italic">back.</span>
              </>
            )}
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            {mode === "signup"
              ? "Create your TrackIt account to start logging."
              : "Sign in to resume your program."}
          </p>

          <form onSubmit={onSubmit} className="mt-10 space-y-5">
            {mode === "signup" && (
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  required
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
                required
                value={form.password}
                onChange={(e) => update("password", e.target.value)}
              />
            </div>
            {mode === "signup" && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    min={1}
                    required
                    value={form.age}
                    onChange={(e) => update("age", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    min={1}
                    required
                    value={form.weight}
                    onChange={(e) => update("weight", e.target.value)}
                  />
                </div>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-primary py-6 text-base font-medium text-primary-foreground shadow-[var(--shadow-gold)] hover:bg-primary/90"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : mode === "signup" ? (
                "Create account"
              ) : (
                "Sign in"
              )}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            {mode === "signup" ? "Already enlisted?" : "New to TrackIt?"}{" "}
            <button
              onClick={() => setMode(mode === "signup" ? "login" : "signup")}
              className="text-primary underline-offset-4 hover:underline"
            >
              {mode === "signup" ? "Sign in" : "Create an account"}
            </button>
          </p>
        </div>
      </div>

      {/* Image */}
      <div className="relative hidden lg:block">
        <img
          src={authImg}
          alt="A chalked hand gripping a barbell in dramatic light"
          width={1280}
          height={1600}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent" />
        <div className="absolute inset-0 grain" />
        <div className="absolute bottom-12 right-12 max-w-sm text-right">
          <p className="font-display text-3xl text-gold italic">
            "Discipline equals freedom."
          </p>
        </div>
      </div>
    </div>
  );
}
