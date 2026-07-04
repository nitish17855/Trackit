import express from "express"
import { exercisesTable, workoutTable } from "../src/db/schema.js"
import db from "../src/db/index.js"
import { eq } from "drizzle-orm";
import { ensure_authenticated } from "../middleware/verify_token.js";
const router = express.Router()
router.use(ensure_authenticated)
router.delete("/delete-workout/:id" , async(req,res)=>{
     const {id} = req.params

     const [deleted] = await db
     .delete(workoutTable)
     .where(eq (id , workoutTable.id))


     res.status(204).json({message :"succesfully deleted"})
})
export default router 


