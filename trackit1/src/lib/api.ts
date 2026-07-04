const API_BASE =
  (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:8000";

const TOKEN_KEY = "trackit_token";
const USER_KEY = "trackit_user";

export type User = { name: string; email: string };

export const auth = {
  getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(TOKEN_KEY);
  },
  setToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
  },
  getUser(): User | null {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  },
  setUser(u: User) {
    localStorage.setItem(USER_KEY, JSON.stringify(u));
  },
  clear() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
};

async function request<T>(
  path: string,
  opts: { method?: string; body?: unknown; protected?: boolean } = {},
): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (opts.protected) {
    const token = auth.getToken();
    if (!token) throw new Error("Not authenticated");
    headers.Authorization = `Bearer ${token}`;
  }
  const res = await fetch(`${API_BASE}${path}`, {
    method: opts.method ?? "GET",
    headers,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  const text = await res.text();
  const data = text ? safeParse(text) : null;
  if (!res.ok) {
    const msg =
      (data && (data.message || data.error)) ||
      `Request failed (${res.status})`;
    throw new Error(msg);
  }
  return data as T;
}

function safeParse(t: string) {
  try {
    return JSON.parse(t);
  } catch {
    return t;
  }
}

export type Exercise = {
  id?: number | string;
  exercise_name?: string;
  name?: string;
  body_part?: string;
  equipment?: string;
  target?: string;
  gif_url?: string;
  [k: string]: unknown;
};

export type WorkoutEntry = {
  id: number;
  day: string;
  exercise_name: string;
  sets: number;
  reps: number;
  weight: number;
  is_completed?: boolean;
  comment?: string | null;
};

export type ReportData = {
  discipline?: unknown;
  weight?: unknown;
  repetitions?: unknown;
  [k: string]: unknown;
};

export type ScheduleWorkoutInput = {
  name: string;
  title: string;
  message: string;
  runAt: string;
};

export type ProgressData = {
  attendance: Array<{ date: string; attended: boolean }>;
  progress: Array<{ date: string; attended: boolean; completed: number }>;
};

export const api = {
  health: () => request<string>("/"),
  signup: (body: {
    name: string;
    email: string;
    password: string;
    age: number;
    weight: number;
  }) => request<{ message?: string }>("/signup", { method: "POST", body }),
  login: (body: { email: string; password: string }) =>
    request<{ token: string; user?: User; name?: string }>("/login", {
      method: "POST",
      body,
    }),
  exercises: async (bodyPart: string) => {
    const result = await request<Exercise[] | { exercises: Exercise[] }>(
      `/exercises?body_part=${encodeURIComponent(bodyPart)}`,
      { protected: true },
    );
    return Array.isArray(result) ? result : result.exercises;
  },
  createWorkout: (body: {
    day: string;
    exercises: Array<{
      exercise_name: string;
      sets: number;
      reps: number;
      weight: number;
    }>;
  }) =>
    request<{ message?: string }>("/create-workout", {
      method: "POST",
      body,
      protected: true,
    }),
  // listWorkout: () =>
  //   request<WorkoutEntry[] | { workouts: WorkoutEntry[] }>("/list-workout", {
  //     protected: true,
  //   }),
  listWorkout: async (day: string) => {
    const result = await request<
      Array<WorkoutEntry & { is_complete?: boolean }> | { workouts: Array<WorkoutEntry & { is_complete?: boolean }> }
    >(`/list-workout?day=${encodeURIComponent(day)}`, { protected: true });
    const workouts = Array.isArray(result) ? result : result.workouts;
    return workouts.map(({ is_complete, ...workout }) => ({
      ...workout,
      day,
      is_completed: workout.is_completed ?? is_complete ?? false,
    }));
  },
  updateWorkout: (
    id: number,
    body: Partial<Pick<WorkoutEntry, "sets" | "reps" | "weight" | "is_completed" | "comment">>,
  ) =>
    request<{ message?: string }>(`/update-workout/${id}`, {
      method: "PATCH",
      body,
      protected: true,
    }),
  deleteWorkout: (id: number) =>
    request<{ message?: string }>(`/delete-workout/${id}`, {
      method: "DELETE",
      protected: true,
    }),
  report: () => request<ReportData>("/generate-pdf", { protected: true }),
  scheduleWorkout: (body: ScheduleWorkoutInput) =>
    request<{ message?: string; id?: number }>("/schedule_task", {
      method: "POST",
      body,
      protected: true,
    }),
  progress: () => request<ProgressData>("/progress", { protected: true }),
  setAttendance: (date: string, attended: boolean) =>
    request(`/attendance/${date}`, { method: "PUT", body: { attended }, protected: true }),
};

export const BODY_PARTS = [
  "Abdominals",
  "Biceps",
  "Chest",
  "Forearms",
  "Glutes",
  "Hamstrings",
  "Lats",
 "Lower Back",
 "Middle Back",
 "Traps",
 "Neck",
 "Quadriceps",
 "Shoulders",
];
