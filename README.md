# TrackIt — Workout Progress Tracker

TrackIt is a full-stack workout tracking website. It helps users create workout plans, record exercises,schedule exercises ,  mark completed workouts, and see how consistently they are training.

## Features

- Create an account and sign in securely
- Browse exercises by body part
- Create, edit, complete, and delete workout entries
- Organize workouts by day of the week
- Record sets, repetitions, weight, and notes
- Check in after attending an exercise session
- See attended days highlighted in green on a calendar
- View progress over time in a line chart
- Review workout statistics and reports
- Schedule workout reminders

Each user's workouts, attendance, and progress are kept separate.

## Project Structure

```text
Workout_program/
├── trackit1/     # React and TanStack frontend
├── Backened/     # Express API and PostgreSQL database
└── README.md
```

## Requirements

Install these before starting:

- Node.js 20 or newer
- npm
- Docker Desktop, or a locally installed PostgreSQL database

## 1. Configure the Backend

Open `Backened` and create a `.env` file:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/trackit
SECRET_KEY=replace_this_with_a_long_random_secret
```

Do not commit the `.env` file or share its secret values.

## 2. Start PostgreSQL

The included Docker configuration starts PostgreSQL and Redis:

```powershell
cd Backened
docker compose up -d
```

If PostgreSQL is already installed locally, create a database and update `DATABASE_URL` to match it.

## 3. Install Backend Dependencies and Migrate the Database

```powershell
cd Backened
npm install
npx drizzle-kit migrate
```

The migration creates all required tables, including daily attendance data used by the calendar and progress chart.

## 4. Run the Backend

```powershell
cd Backened
npm run dev
```

The API runs at:

```text
http://localhost:8000
```

Opening that address should display `Server is running`.

## 5. Install and Run the Frontend

Open another terminal:

```powershell
cd trackit1
npm install
npm run dev
```

Open the local address printed by Vite in the terminal.

The frontend connects to `http://localhost:8000` by default. To use a different backend address, create `trackit1/.env`:

```env
VITE_API_URL=http://localhost:8000
```

Restart the frontend after changing environment variables.

## Typical Usage

1. Create an account or sign in.
2. Add exercises to a day in **My Program**.
3. Mark exercises complete after training.
4. Open **Progress** and confirm that you attended today's exercise.
5. The current date becomes green in the calendar.
6. Continue checking in to build the progress line chart.
7. Open **Report** to review workout statistics.

## Production Check

To confirm that the frontend compiles successfully:

```powershell
cd trackit1
npm run build
```

## Common Problems

### Frontend cannot connect to the backend

- Confirm the backend is running on port `8000`.
- Open `http://localhost:8000` in a browser.
- Check that `VITE_API_URL` contains the correct backend address.
- Restart the frontend after editing `.env`.

### Database connection error

- Confirm Docker Desktop and the PostgreSQL container are running.
- Check that `DATABASE_URL` matches the database username, password, port, and name.
- Run `npx drizzle-kit migrate` from the `Backened` directory.

### Login session expired

Sign out and sign in again. Also confirm that `SECRET_KEY` is configured and remains unchanged while the backend is running.

## Technology

- Frontend: React, TypeScript, TanStack Router, TanStack Query, Tailwind CSS, Recharts
- Backend: Node.js, Express, JWT
- Database: PostgreSQL, Drizzle ORM
