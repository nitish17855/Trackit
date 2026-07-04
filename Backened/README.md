# TrackIt Backend

REST API for the TrackIt workout application. It provides user authentication, exercise discovery, workout management, and workout-report data.

## Tech stack

- Node.js and Express 5
- PostgreSQL with Drizzle ORM
- Redis for authentication rate limiting
- JSON Web Tokens (JWT)
- Docker Compose for local PostgreSQL and Redis services

## Prerequisites

- Node.js 18 or newer
- npm
- Docker Desktop (recommended), or local PostgreSQL and Redis instances

## Getting started

1. Open the backend directory:

   ```bash
   cd Backened
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in this directory:

   ```env
   DATABASE_URL=postgres://postgres:password@localhost:5432/quizzo
   SECRET_KEY=replace_with_a_long_random_secret
   ```

4. Start PostgreSQL and Redis:

   ```bash
   docker compose up -d
   ```

5. Apply the existing database migrations:

   ```bash
   npx drizzle-kit migrate
   ```

6. Optionally import the exercise dataset:

   ```bash
   node seed/seed.js
   ```

7. Start the API:

   ```bash
   npm run dev
   ```

The server runs at `http://localhost:8000`. A request to `GET /` should return `Server is running`.

The frontend origin is currently configured as `http://localhost:5173` in `index.js`.

## Authentication

Protected routes expect a JWT in the request header:

```http
Authorization: Bearer <token>
```

Obtain a token from `POST /login`. Signup and login requests are limited to five requests per IP address per minute using Redis.

## API endpoints

| Method | Endpoint | Protected | Description |
| --- | --- | --- | --- |
| `GET` | `/` | No | Health check |
| `POST` | `/signup` | No | Register a user |
| `POST` | `/login` | No | Return a JWT for a registered email |
| `GET` | `/exercises?body_part=...` | Yes | List exercises for a body part |
| `POST` | `/create-workout` | Yes | Create workout entries for a day |
| `GET` | `/list-workout` | Yes | List workout entries |
| `PATCH` | `/update-workout/:id` | Yes | Update fields on a workout entry |
| `DELETE` | `/delete-workout/:id` | Yes | Delete a workout entry |
| `GET` | `/generate-pdf` | Intended | Return discipline, weight, and repetition report data |

### Example request bodies

Signup:

```json
{
  "name": "Alex",
  "email": "alex@example.com",
  "password": "your-password",
  "age": 25,
  "weight": 75
}
```

Login:

```json
{
  "email": "alex@example.com",
  "password": "your-password"
}
```

Create workout:

```json
{
  "day": "Monday",
  "exercises": [
    {
      "exercise_name": "Bench Press",
      "sets": 3,
      "reps": 10,
      "weight": 60
    }
  ]
}
```

Update workout (send only the fields that should change):

```json
{
  "is_completed": true,
  "comment": "Completed all sets"
}
```

## Database commands

After modifying `src/db/schema.js`, generate and apply a migration:

```bash
npx drizzle-kit generate
npx drizzle-kit migrate
```

To open Drizzle Studio:

```bash
npx drizzle-kit studio
```

## Project structure

```text
Backened/
├── controllers/       # Report queries and calculations
├── data/              # Exercise CSV dataset
├── drizzle/           # Generated SQL migrations
├── middleware/        # JWT verification and rate limiting
├── routers/           # Express route handlers
├── seed/              # Exercise-data importer
├── src/
│   ├── config/        # Redis client
│   └── db/            # Drizzle connection and schema
├── docker-compose.yml
├── drizzle.config.js
└── index.js            # Express application entry point
```

## Current limitations

- Passwords are currently stored and accepted without hashing or password comparison. Add a password-hashing library before production use.
- `/generate-pdf` reads `req.user` but does not currently attach the authentication middleware; it will fail until `ensure_authenticated` is added to that router.
- The report endpoint returns JSON report data despite its `/generate-pdf` name; it does not generate a PDF file.
- The unused `schedule_workout.js` router and general rate limiter are incomplete and are not mounted by the application.
- The API port, Redis URL, and allowed frontend origin are currently hard-coded.

## License

No license has been specified for this project.
