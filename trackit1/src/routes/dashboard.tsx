import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  api,
  auth,
  BODY_PARTS,
  type Exercise,
  type WorkoutEntry,
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  Plus,
  Trash2,
  Pencil,
  LogOut,
  Dumbbell,
  CalendarDays,
  BarChart3,
  Loader2,
  BellRing,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<ReturnType<typeof auth.getUser>>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const u = auth.getUser();
    if (!auth.getToken()) {
      navigate({ to: "/auth" });
      return;
    }
    setUser(u);
    setReady(true);
  }, [navigate]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  function logout() {
    auth.clear();
    navigate({ to: "/" });
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 px-6 py-4 backdrop-blur-xl md:px-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link to="/" className="font-display text-2xl text-gold">
            TrackIt
          </Link>
          <div className="flex items-center gap-4">
            <div className="hidden text-right md:block">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                Athlete
              </p>
              <p className="text-sm">{user?.name ?? user?.email}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="text-muted-foreground hover:text-foreground"
            >
              <LogOut className="mr-2 h-4 w-4" /> Sign out
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10 md:px-10">
        <div className="mb-10">
          <p className="text-xs uppercase tracking-[0.4em] text-primary/80">
            Today is {new Date().toLocaleDateString(undefined, { weekday: "long" })}
          </p>
          <h1 className="mt-2 font-display text-5xl md:text-6xl">
            Welcome, <span className="text-gold italic">{user?.name?.split(" ")[0] ?? "athlete"}.</span>
          </h1>
        </div>

        <Tabs defaultValue="workouts" className="w-full">
          <TabsList className="mb-8 grid h-auto w-full grid-cols-2 bg-card md:w-auto md:grid-cols-5 md:inline-grid">
            <TabsTrigger value="workouts" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <CalendarDays className="mr-2 h-4 w-4" /> My program
            </TabsTrigger>
            <TabsTrigger value="exercises" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Dumbbell className="mr-2 h-4 w-4" /> Library
            </TabsTrigger>
            <TabsTrigger value="report" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <BarChart3 className="mr-2 h-4 w-4" /> Report
            </TabsTrigger>
            <TabsTrigger value="progress" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <TrendingUp className="mr-2 h-4 w-4" /> Progress
            </TabsTrigger>
            <TabsTrigger value="schedule" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <BellRing className="mr-2 h-4 w-4" /> Schedule
            </TabsTrigger>
          </TabsList>

          <TabsContent value="workouts">
            <WorkoutsPanel />
          </TabsContent>
          <TabsContent value="exercises">
            <ExercisesPanel />
          </TabsContent>
          <TabsContent value="report">
            <ReportPanel />
          </TabsContent>
          <TabsContent value="progress">
            <ProgressPanel />
          </TabsContent>
          <TabsContent value="schedule">
            <ScheduleWorkoutPanel defaultName={user?.name ?? ""} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function localDateKey(date = new Date()) {
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 10);
}

function ProgressPanel() {
  const qc = useQueryClient();
  const today = localDateKey();
  const { data, isLoading, error } = useQuery({ queryKey: ["progress"], queryFn: api.progress });
  const attendedDates = new Set(data?.attendance.filter((x) => x.attended).map((x) => x.date) ?? []);
  const attendedToday = attendedDates.has(today);
  const mark = useMutation({
    mutationFn: (attended: boolean) => api.setAttendance(today, attended),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["progress"] }); toast.success("Attendance updated"); },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Could not update attendance"),
  });
  const monthStart = new Date(); monthStart.setDate(1);
  const cells = Array.from({ length: 42 }, (_, i) => {
    const d = new Date(monthStart); d.setDate(i - monthStart.getDay() + 1); return d;
  });

  return <div className="space-y-8">
    <div><h2 className="font-display text-3xl">Your progress</h2><p className="mt-1 text-sm text-muted-foreground">Show up, check in, and watch consistency compound.</p></div>
    {isLoading && <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" />}
    {error && <p className="text-sm text-destructive">{error instanceof Error ? error.message : "Could not load progress"}</p>}
    {!isLoading && !error && <>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6">
          <p className="text-xs uppercase tracking-widest text-primary">Today's check-in</p>
          <h3 className="mt-3 font-display text-2xl">Did you attend your exercise today?</h3>
          <Button className="mt-6 rounded-full" variant={attendedToday ? "outline" : "default"} disabled={mark.isPending} onClick={() => mark.mutate(!attendedToday)}>
            <CheckCircle2 className="mr-2 h-4 w-4" /> {attendedToday ? "Attended — undo" : "Yes, I attended"}
          </Button>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="font-display text-xl">Attendance calendar</h3>
          <div className="mt-4 grid grid-cols-7 gap-2 text-center text-xs">{["S","M","T","W","T","F","S"].map((x,i)=><span key={i} className="text-muted-foreground">{x}</span>)}
          {cells.map((d) => { const key=localDateKey(d); const inMonth=d.getMonth()===monthStart.getMonth(); const done=attendedDates.has(key); return <div key={key} title={key} className={`flex aspect-square items-center justify-center rounded-md ${done ? "bg-emerald-500 font-semibold text-white" : "bg-secondary/50"} ${inMonth ? "" : "opacity-25"}`}>{d.getDate()}</div>; })}</div>
        </div>
      </div>
      <div className="rounded-2xl border border-border bg-card p-6">
        <h3 className="font-display text-xl">Consistency over time</h3>
        {data?.progress.length ? <div className="mt-6 h-72"><ResponsiveContainer width="100%" height="100%"><LineChart data={data.progress}><XAxis dataKey="date" tickFormatter={(v)=>String(v).slice(5)} stroke="currentColor" opacity={0.5}/><YAxis allowDecimals={false} stroke="currentColor" opacity={0.5}/><Tooltip/><Line type="monotone" dataKey="completed" stroke="#22c55e" strokeWidth={3} dot={{ r: 3 }}/></LineChart></ResponsiveContainer></div> : <p className="py-16 text-center text-muted-foreground">Check in after today's exercise to start your chart.</p>}
      </div>
    </>}
  </div>;
}

function formatRunAt(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) throw new Error("Choose a valid date and time");
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const period = date.getHours() >= 12 ? "PM" : "AM";
  const hours = date.getHours() % 12 || 12;
  return `${day}/${month}/${year} ${hours}:${minutes} ${period}`;
}

function ScheduleWorkoutPanel({ defaultName }: { defaultName: string }) {
  const [name, setName] = useState(defaultName);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [runAt, setRunAt] = useState("");

  useEffect(() => setName((current) => current || defaultName), [defaultName]);

  const schedule = useMutation({
    mutationFn: () =>
      api.scheduleWorkout({ name: name.trim(), title: title.trim(), message: message.trim(), runAt: formatRunAt(runAt) }),
    onSuccess: () => {
      toast.success("Workout scheduled");
      setTitle("");
      setMessage("");
      setRunAt("");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed to schedule workout"),
  });

  const canSubmit = name.trim() && title.trim() && runAt;

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h2 className="font-display text-3xl">Schedule a workout</h2>
        <p className="mt-1 text-sm text-muted-foreground">Set a date and receive a reminder when it is time to train.</p>
      </div>
      <div className="space-y-5 rounded-2xl border border-border bg-card p-6 md:p-8">
        <div>
          <Label htmlFor="schedule-name">Name</Label>
          <Input id="schedule-name" value={name} onChange={(e) => setName(e.target.value)} className="mt-2" />
        </div>
        <div>
          <Label htmlFor="schedule-title">Workout title</Label>
          <Input id="schedule-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Upper-body session" className="mt-2" />
        </div>
        <div>
          <Label htmlFor="schedule-message">Reminder message</Label>
          <Textarea id="schedule-message" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Bring straps and remember to warm up." className="mt-2" />
        </div>
        <div>
          <Label htmlFor="schedule-time">Date and time</Label>
          <Input id="schedule-time" type="datetime-local" value={runAt} onChange={(e) => setRunAt(e.target.value)} min={new Date().toISOString().slice(0, 16)} className="mt-2" />
        </div>
        <Button onClick={() => schedule.mutate()} disabled={!canSubmit || schedule.isPending} className="w-full rounded-full bg-primary text-primary-foreground">
          {schedule.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <><BellRing className="mr-2 h-4 w-4" /> Schedule workout</>}
        </Button>
      </div>
    </div>
  );
}

/* ------------------ Workouts ------------------ */

function WorkoutsPanel() {
   const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const [selectedDay, setSelectedDay] = useState("Monday");
  const qc = useQueryClient();
 const { data, isLoading, error } = useQuery({
  queryKey: ["workouts", selectedDay],
  queryFn: () => api.listWorkout(selectedDay),
});

  const workouts: WorkoutEntry[] = data ?? [];

  const del = useMutation({
    mutationFn: (id: number) => api.deleteWorkout(id),
    onSuccess: () => {
      toast.success("Entry removed");
      qc.invalidateQueries({ queryKey: ["workouts"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed"),
  });

  const update = useMutation({
    mutationFn: ({ id, body }: { id: number; body: Partial<WorkoutEntry> }) =>
      api.updateWorkout(id, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["workouts"] }),
  });

  return (
  <div>
    <div className="mb-8 flex items-center justify-between">
      <div>
        <h2 className="font-display text-3xl">Your workout</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Plan it. Conquer it. Tick it off.
        </p>
      </div>
      <CreateWorkoutDialog />
    </div>

    {/* Day Selection */}
    <div className="mb-6 flex items-center gap-4">
      <label className="text-sm font-medium">
        Select Day
      </label>

      <select
        value={selectedDay}
        onChange={(e) => setSelectedDay(e.target.value)}
        className="rounded-lg border border-border bg-card px-4 py-2"
      >
        {DAYS.map((day) => (
          <option key={day} value={day}>
            {day}
          </option>
        ))}
      </select>
    </div>

    {/* Loading */}
    {isLoading && (
      <div className="flex justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    )}

    {/* Error */}
    {error && (
      <p className="text-sm text-destructive">
        {error instanceof Error
          ? error.message
          : "Failed to load"}
      </p>
    )}

    {/* Empty */}
    {!isLoading && workouts.length === 0 && (
      <div className="rounded-2xl border border-dashed border-border bg-card/40 p-16 text-center">
        <p className="font-display text-2xl">
          No entries yet
        </p>

        <p className="mt-2 text-sm text-muted-foreground">
          Build your first workout or add one manually.
        </p>
      </div>
    )}

    {/* Workout Card */}
    {!isLoading && workouts.length > 0 && (
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border bg-secondary/40 px-5 py-4">
          <p className="font-display text-xl">
            {selectedDay}
          </p>

          <Badge
            variant="outline"
            className="border-primary/40 text-primary"
          >
            {workouts.length} lifts
          </Badge>
        </div>

        <ul className="divide-y divide-border">
          {workouts.map((w) => (
            <li
              key={w.id}
              className="flex items-start gap-3 p-4"
            >
              <Checkbox
                checked={!!w.is_completed}
                onCheckedChange={(c) =>
                  update.mutate({
                    id: w.id,
                    body: {
                      is_completed: Boolean(c),
                    },
                  })
                }
                className="mt-1"
              />

              <div className="flex-1">
                <p
                  className={`font-medium ${
                    w.is_completed
                      ? "line-through text-muted-foreground"
                      : ""
                  }`}
                >
                  {w.exercise_name}
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  {w.sets} × {w.reps} · {w.weight} kg
                </p>

                {w.comment && (
                  <p className="mt-2 text-xs italic text-muted-foreground">
                    "{w.comment}"
                  </p>
                )}
              </div>

              <div className="flex gap-1">
                <EditEntryDialog entry={w} />

                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => del.mutate(w.id)}
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
  )
};
function CreateWorkoutDialog({ prefill }: { prefill?: { exercise_name: string } } = {}) {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [day, setDay] = useState("Monday");
  const [rows, setRows] = useState([
    { exercise_name: prefill?.exercise_name ?? "", sets: 3, reps: 10, weight: 20 },
  ]);

  useEffect(() => {
    if (open && prefill?.exercise_name) {
      setRows([{ exercise_name: prefill.exercise_name, sets: 3, reps: 10, weight: 20 }]);
    }
  }, [open, prefill?.exercise_name]);

  const create = useMutation({
    mutationFn: api.createWorkout,
    onSuccess: () => {
      toast.success("Workout added");
      qc.invalidateQueries({ queryKey: ["workouts"] });
      setOpen(false);
      setRows([{ exercise_name: "", sets: 3, reps: 10, weight: 20 }]);
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed"),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4" /> Add workout
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl border-border bg-card">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">New entry</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Day</Label>
            <Select value={day} onValueChange={setDay}>
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DAYS.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            {rows.map((r, i) => (
              <div key={i} className="grid grid-cols-12 gap-2">
                <Input
                  className="col-span-5"
                  placeholder="Exercise"
                  value={r.exercise_name}
                  onChange={(e) =>
                    setRows((rs) =>
                      rs.map((x, j) => (i === j ? { ...x, exercise_name: e.target.value } : x)),
                    )
                  }
                />
                <Input
                  className="col-span-2"
                  type="number"
                  placeholder="Sets"
                  value={r.sets}
                  onChange={(e) =>
                    setRows((rs) =>
                      rs.map((x, j) => (i === j ? { ...x, sets: +e.target.value } : x)),
                    )
                  }
                />
                <Input
                  className="col-span-2"
                  type="number"
                  placeholder="Reps"
                  value={r.reps}
                  onChange={(e) =>
                    setRows((rs) =>
                      rs.map((x, j) => (i === j ? { ...x, reps: +e.target.value } : x)),
                    )
                  }
                />
                <Input
                  className="col-span-2"
                  type="number"
                  placeholder="kg"
                  value={r.weight}
                  onChange={(e) =>
                    setRows((rs) =>
                      rs.map((x, j) => (i === j ? { ...x, weight: +e.target.value } : x)),
                    )
                  }
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="col-span-1"
                  onClick={() => setRows((rs) => rs.filter((_, j) => j !== i))}
                  disabled={rows.length === 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setRows((rs) => [...rs, { exercise_name: "", sets: 3, reps: 10, weight: 20 }])
              }
            >
              <Plus className="mr-2 h-4 w-4" /> Add lift
            </Button>
          </div>

          <Button
            onClick={() =>
              create.mutate({
                day,
                exercises: rows.filter((r) => r.exercise_name.trim()),
              })
            }
            disabled={create.isPending}
            className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {create.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save workout"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function EditEntryDialog({ entry }: { entry: WorkoutEntry }) {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [sets, setSets] = useState(entry.sets);
  const [reps, setReps] = useState(entry.reps);
  const [weight, setWeight] = useState(entry.weight);
  const [comment, setComment] = useState(entry.comment ?? "");

  const update = useMutation({
    mutationFn: () =>
      api.updateWorkout(entry.id, { sets, reps, weight, comment }),
    onSuccess: () => {
      toast.success("Updated");
      qc.invalidateQueries({ queryKey: ["workouts"] });
      setOpen(false);
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed"),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-primary">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="border-border bg-card">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">{entry.exercise_name}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <Label>Sets</Label>
            <Input type="number" value={sets} onChange={(e) => setSets(+e.target.value)} className="mt-2" />
          </div>
          <div>
            <Label>Reps</Label>
            <Input type="number" value={reps} onChange={(e) => setReps(+e.target.value)} className="mt-2" />
          </div>
          <div>
            <Label>Weight (kg)</Label>
            <Input type="number" value={weight} onChange={(e) => setWeight(+e.target.value)} className="mt-2" />
          </div>
        </div>
        <div>
          <Label>Notes</Label>
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="How did it feel?"
            className="mt-2"
          />
        </div>
        <Button
          onClick={() => update.mutate()}
          disabled={update.isPending}
          className="rounded-full bg-primary text-primary-foreground"
        >
          {update.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}

/* ------------------ Exercises ------------------ */

function ExercisesPanel() {
  const [bodyPart, setBodyPart] = useState("Shoulders");
  const { data, isLoading, error } = useQuery({
    queryKey: ["exercises", bodyPart],
    queryFn: () => api.exercises(bodyPart),
  });

  const exercises = Array.isArray(data) ? data : [];

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl">Exercise library</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Choose a target. Build your set.
          </p>
        </div>
        <div className="w-full max-w-xs">
          <Label className="text-xs uppercase tracking-widest text-muted-foreground">
            Body part
          </Label>
          <Select value={bodyPart} onValueChange={setBodyPart}>
            <SelectTrigger className="mt-2 capitalize">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {BODY_PARTS.map((b) => (
                <SelectItem key={b} value={b} className="capitalize">
                  {b}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading && (
        <div className="flex justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      )}
      {error && (
        <p className="text-sm text-destructive">
          {error instanceof Error ? error.message : "Failed to load"}
        </p>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {exercises.map((ex: Exercise, i: number) => {
          const name = ex.exercise_name ?? ex.name ?? "Unknown";
          return (
            <div
              key={String(ex.id ?? i)}
              className="group rounded-2xl border border-border bg-card p-6 transition hover:border-primary/40"
            >
              <p className="text-xs uppercase tracking-widest text-primary/80">
                {String(ex.body_part ?? bodyPart)}
              </p>
              <h3 className="mt-2 font-display text-xl capitalize">{name}</h3>
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                {ex.equipment ? (
                  <Badge variant="outline" className="capitalize">
                    {String(ex.equipment)}
                  </Badge>
                ) : null}
                {ex.target ? (
                  <Badge variant="outline" className="capitalize">
                    {String(ex.target)}
                  </Badge>
                ) : null}
              </div>
              <div className="mt-5">
                <CreateWorkoutDialog prefill={{ exercise_name: String(name) }} />
              </div>
            </div>
          );
        })}
      </div>

      {!isLoading && exercises.length === 0 && !error && (
        <p className="py-20 text-center text-muted-foreground">No exercises found.</p>
      )}
    </div>
  );
}

/* ------------------ Report ------------------ */

type ExerciseStat = {
  exercise: string;
  minWeight?: number | null;
  maxWeight?: number | null;
  avgWeight?: number | null;
  minreps?: number | null;
  maxreps?: number | null;
  avgreps?: number | null;
};

type Discipline = {
  totalTasks?: number;
  completedCount?: number;
  completionRate?: number | string;
  [k: string]: unknown;
};

function fmt(n: unknown) {
  if (n === null || n === undefined || n === "") return "—";
  if (typeof n === "number") return Number.isInteger(n) ? String(n) : n.toFixed(1);
  return String(n);
}

function asArray(v: unknown): ExerciseStat[] {
  return Array.isArray(v) ? (v as ExerciseStat[]) : [];
}

function ReportPanel() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["report"],
    queryFn: api.report,
  });

  const d = (data ?? {}) as Record<string, unknown>;
  const discipline = (d.discipline ?? null) as Discipline | null;
  const weighted = asArray(d.weighted_report ?? d.weight);
  const reps = asArray(d.rep_report ?? d.repetitions);

  const completion =
    discipline && typeof discipline.totalTasks === "number" && discipline.totalTasks > 0
      ? Math.round(((discipline.completedCount ?? 0) / discipline.totalTasks) * 100)
      : null;

  return (
    <div>
      <div className="mb-8">
        <h2 className="font-display text-3xl">Your report</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Discipline, volume, and repetitions — distilled.
        </p>
      </div>

      {isLoading && (
        <div className="flex justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-6 text-sm text-destructive">
          {error instanceof Error ? error.message : "Failed to load report"}
          <p className="mt-2 text-xs opacity-80">
            Note: the backend's <code>/generate-pdf</code> endpoint must have
            auth middleware attached to return data.
          </p>
        </div>
      )}

      {data && (
        <div className="space-y-8">
          {discipline && (
            <div className="grid gap-6 md:grid-cols-3">
              <StatCard label="Total tasks" value={fmt(discipline.totalTasks)} />
              <StatCard label="Completed" value={fmt(discipline.completedCount)} />
              <StatCard
                label="Discipline"
                value={completion !== null ? `${completion}%` : fmt(discipline.completionRate)}
              />
            </div>
          )}

          {weighted.length > 0 && (
            <ReportTable
              title="Weight per exercise"
              rows={weighted}
              columns={[
                { key: "minWeight", label: "Min (kg)" },
                { key: "maxWeight", label: "Max (kg)" },
                { key: "avgWeight", label: "Avg (kg)" },
              ]}
            />
          )}

          {reps.length > 0 && (
            <ReportTable
              title="Repetitions per exercise"
              rows={reps}
              columns={[
                { key: "minreps", label: "Min" },
                { key: "maxreps", label: "Max" },
                { key: "avgreps", label: "Avg" },
              ]}
            />
          )}

          {!discipline && weighted.length === 0 && reps.length === 0 && (
            <p className="py-12 text-center text-muted-foreground">
              No report data yet. Complete some workouts to see your stats.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-8">
      <p className="text-xs uppercase tracking-[0.3em] text-primary/80">{label}</p>
      <p className="mt-4 font-display text-5xl text-gold">{value}</p>
    </div>
  );
}

function ReportTable({
  title,
  rows,
  columns,
}: {
  title: string;
  rows: ExerciseStat[];
  columns: { key: keyof ExerciseStat; label: string }[];
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="border-b border-border bg-secondary/40 px-6 py-4">
        <p className="font-display text-xl">{title}</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-widest text-muted-foreground">
              <th className="px-6 py-3 font-normal">Exercise</th>
              {columns.map((c) => (
                <th key={String(c.key)} className="px-6 py-3 font-normal">
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-t border-border/60">
                <td className="px-6 py-3 capitalize">{r.exercise}</td>
                {columns.map((c) => (
                  <td key={String(c.key)} className="px-6 py-3 text-gold">
                    {fmt(r[c.key])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
