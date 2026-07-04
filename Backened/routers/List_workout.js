import express from "express"
import db from "../src/db/index.js"
import { and, eq } from "drizzle-orm";
import { exercisesTable, workoutTable } from "../src/db/schema.js";
import { ensure_authenticated } from "../middleware/verify_token.js";

const router = express.Router()
router.use(ensure_authenticated)
router.get("/list-workout" , async(req,res) =>{

    const day= req.query.day

    const workouts = await db
    .select({
        id :workoutTable.id ,
        exercise_name : workoutTable.exercise_name ,
        sets : workoutTable.sets ,
        weight : workoutTable.weight,
        reps : workoutTable.reps ,
        is_complete : workoutTable.is_completed,
        comment : workoutTable.comment
    }).from(workoutTable).where(and(eq(workoutTable.day , day), eq(workoutTable.email, req.user.email)))
 
    res.status(200).json(workouts)
    
})

export default router 
