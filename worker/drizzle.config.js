import "dotenv/config";

export default {
  schema: "../Backened/src/db/schema.js",
  out: "../Backened/drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
};
