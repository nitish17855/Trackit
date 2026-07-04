import express from "express"
import { workoutTable } from "../src/db/schema.js"
import { and, eq } from "drizzle-orm";
import db from "../src/db/index.js"
import { ensure_authenticated } from "../middleware/verify_token.js";

const router = express.Router()
router.use(ensure_authenticated)
router.patch("/update-workout/:id" , async(req , res) =>{
    const { id }= req.params

    const [updated_workout] = await db
    .update(workoutTable)
    .set(req.body)
    .where(and(eq(workoutTable.id, Number(id)), eq(workoutTable.email, req.user.email)))

    res.status(200).json({message : 'succesfully updated'})
})


export default router ;
