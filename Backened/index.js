import express from "express";
import userSign from "./routers/Signin.js"
import userlogin from "./routers/Login.js"
import exercises from "./routers/get_exercises.js"
import create_workout from "./routers/create_workout.js"
import update_workout from "./routers/Update_workout.js"
import list_workout from "./routers/List_workout.js"
import delete_workout from "./routers/delete_workout.js"
import generater_report from "./routers/generate.js"
import schedule_workout from "./routers/schedule_workout.js"
import progress from "./routers/progress.js"
import cors from "cors";

const app = express();
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)) return callback(null, true);
      callback(new Error("Origin not allowed by CORS"));
    },
    credentials: true,
  })
);
const PORT = 8000;
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Server is running");
});

app.use("/" , userSign)
app.use("/" , userlogin)
app.use("/" , exercises )
app.use("/" , create_workout)
app.use("/" , update_workout)
app.use("/" , list_workout)
app.use("/" , delete_workout)
app.use("/" , generater_report)
app.use('/' , schedule_workout)
app.use('/' , progress)

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Something went wrong. Please try again." });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
