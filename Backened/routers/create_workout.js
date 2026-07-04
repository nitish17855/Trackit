import express from "express"
import { workoutTable } from "../src/db/schema.js"
import db from "../src/db/index.js"
import { ensure_authenticated } from "../middleware/verify_token.js"

const router = express.Router()
router.use(ensure_authenticated)

router.post("/create-workout" , async(req,res) =>{
    try{const { exercises , day} = req.body


 const rows = exercises.map(exercise => ({
  exercise_name: exercise.exercise_name,
  day : day ,
  sets: exercise.sets,
  reps: exercise.reps,
  weight: exercise.weight
  ,email: req.user.email
}));
console.log(rows)
    const [workout] = await db
    .insert(workoutTable).values(
        rows
    ).returning({workout_id : workoutTable.id})


    res.status(201).json({message :" succesfully created"})
} catch(error){console.log(error.message); res.status(500).json({ message: "Could not create workout" });} }
)


export default router ;
