import express from "express"
import { exercisesTable, workoutTable } from "../src/db/schema.js"
import db from "../src/db/index.js"
import { eq } from "drizzle-orm";
import { ensure_authenticated } from "../middleware/verify_token.js";
const router = express.Router()
router.use(ensure_authenticated)
router.get("/exercises" , async(req , res) =>{
   const body_part = req.query.body_part
    const exercises = await db
    .select({
      
      exercise_name : exercisesTable.exercise_name ,
      body_part : exercisesTable.body_part ,
      level : exercisesTable.level ,
      equipment : exercisesTable.equipment
    }).from(exercisesTable).where(eq(body_part , exercisesTable.body_part))

    res.status(200).json({exercises})
})





export default router 