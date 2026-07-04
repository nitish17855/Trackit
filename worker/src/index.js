import dotenv from "dotenv";

dotenv.config();

// const postgres = require("postgres");
import postgres from "postgres"
// const { drizzle } = require("drizzle-orm/postgres-js");
import {drizzle} from "drizzle-orm/postgres-js"
import * as schema from "../../Backened/src/db/schema.js";

const client = postgres(
  process.env.DATABASE_URL
);

const db = drizzle(client, { schema });

export default db ;
