import express from "express";
import { and, asc, eq } from "drizzle-orm";
import db from "../src/db/index.js";
import { attendanceTable } from "../src/db/schema.js";
import { ensure_authenticated } from "../middleware/verify_token.js";

const router = express.Router();
router.use(ensure_authenticated);

router.get("/progress", async (req, res, next) => {
  try {
    const attendance = await db.select({
      date: attendanceTable.attendedOn,
      attended: attendanceTable.attended,
    }).from(attendanceTable)
      .where(eq(attendanceTable.email, req.user.email))
      .orderBy(asc(attendanceTable.attendedOn));

    let completed = 0;
    const progress = attendance.map((entry) => ({
      ...entry,
      completed: entry.attended ? ++completed : completed,
    }));
    res.json({ attendance, progress });
  } catch (error) { next(error); }
});

router.put("/attendance/:date", async (req, res, next) => {
  try {
    const { date } = req.params;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return res.status(400).json({ message: "Use date format YYYY-MM-DD" });
    const attended = req.body.attended !== false;
    const [record] = await db.insert(attendanceTable)
      .values({ email: req.user.email, attendedOn: date, attended })
      .onConflictDoUpdate({
        target: [attendanceTable.email, attendanceTable.attendedOn],
        set: { attended },
      }).returning();
    res.json(record);
  } catch (error) { next(error); }
});

export default router;
