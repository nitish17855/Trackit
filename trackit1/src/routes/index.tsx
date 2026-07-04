import { createFileRoute, Link } from "@tanstack/react-router";
import heroImg from "@/assets/hero.jpg";
import { ArrowRight, Dumbbell, LineChart, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <header className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 py-6 md:px-12">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-display text-2xl tracking-wide text-gold">TrackIt</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <a href="#features" className="hidden text-muted-foreground hover:text-foreground md:inline">
            Features
          </a>
          <a href="#manifesto" className="hidden text-muted-foreground hover:text-foreground md:inline">
            Manifesto
          </a>
          <Link
            to="/auth"
            className="rounded-full border border-primary/40 bg-primary/10 px-5 py-2 text-primary backdrop-blur transition hover:bg-primary hover:text-primary-foreground"
          >
            Sign in
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative grain vignette h-[100vh] min-h-[700px] overflow-hidden">
        <img
          src={heroImg}
          alt="A barbell under a single shaft of golden light in a cinematic gym"
          width={1920}
          height={1280}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/30 to-background" />

        <div className="relative z-10 flex h-full items-end px-6 pb-24 md:px-16 md:pb-32">
          <div className="max-w-3xl">
            <p className="mb-6 text-xs uppercase tracking-[0.4em] text-primary/80">
              Est. — a journal for the disciplined
            </p>
            <h1 className="font-display text-6xl leading-[0.95] md:text-8xl">
              Lift in <span className="text-gold italic">silence.</span>
              <br />
              Let progress speak.
            </h1>
            <p className="mt-8 max-w-xl text-lg text-muted-foreground">
              TrackIt is a cinematic workout journal — engineered for athletes
              who treat every set as a ritual. Log lifts, command your week,
              and watch discipline compound.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                to="/auth"
                search={{ mode: "signup" }}
                className="group inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground shadow-[var(--shadow-gold)] transition hover:scale-[1.02]"
              >
                Begin your program
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </Link>
              <Link
                to="/auth"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-background/40 px-7 py-3.5 text-sm backdrop-blur transition hover:bg-background/70"
              >
                I already train here
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative px-6 py-32 md:px-16">
        <div className="mx-auto max-w-6xl">
          <p className="mb-4 text-xs uppercase tracking-[0.4em] text-primary/80">
            The system
          </p>
          <h2 className="max-w-2xl font-display text-5xl md:text-6xl">
            Three pillars. <span className="text-gold italic">Zero noise.</span>
          </h2>

          <div className="mt-20 grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-3">
            {[
              {
                icon: Dumbbell,
                title: "Curated library",
                body: "A vetted catalog of exercises by body part — pick, prescribe, perform.",
              },
              {
                icon: LineChart,
                title: "Weekly command",
                body: "Plan each day with sets, reps, and weight. Tick them off as you conquer.",
              },
              {
                icon: ShieldCheck,
                title: "Earned reports",
                body: "Discipline, volume, repetitions — your numbers, distilled.",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="group bg-card p-10 transition hover:bg-card/70"
              >
                <f.icon className="h-7 w-7 text-primary transition group-hover:scale-110" />
                <h3 className="mt-6 font-display text-2xl">{f.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {f.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Manifesto */}
      <section id="manifesto" className="relative border-t border-border px-6 py-32 md:px-16">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-4 text-xs uppercase tracking-[0.4em] text-primary/80">
            Manifesto
          </p>
          <p className="font-display text-3xl leading-relaxed md:text-5xl">
            "We do not chase motivation. We{" "}
            <span className="text-gold italic">build</span> the kind of body
            that proves we showed up — every day, in the dark, when nobody was
            watching."
          </p>
          <div className="mx-auto mt-10 h-px w-24 bg-primary/60" />
          <p className="mt-6 text-sm uppercase tracking-[0.3em] text-muted-foreground">
            The TrackIt code
          </p>
        </div>
      </section>

      <footer className="border-t border-border px-6 py-10 text-center text-xs uppercase tracking-[0.3em] text-muted-foreground md:px-16">
        © {new Date().getFullYear()} TrackIt — Discipline equals freedom
      </footer>
    </div>
  );
}
