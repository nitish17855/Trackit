import { workoutTable } from "../src/db/schema.js";
import { min, max, avg, and, eq } from "drizzle-orm";
import db from "../src/db/index.js"


export async function rep_report(email) {


     const rep_report =[] 
    const exercises = await db
        .selectDistinct({
            exercise: workoutTable.exercise_name
        })
        .from(workoutTable);

        for (const exercise of exercises ) {
         const reps = await db 
        .select({
           minreps: min(workoutTable.reps),
           maxreps: max(workoutTable.reps),
           avgreps: avg(workoutTable.reps)
         })
        .from(workoutTable)
        .where(
         and(
           eq(workoutTable.email, email),
           eq(workoutTable.exercise_name, exercise.exercise)
            )
        )
        console.log(reps)

        rep_report.push({
           exercise : exercise.exercise ,
           minreps : reps[0].minreps ,
           maxreps : reps[0].maxreps ,
           avgreps : reps[0].avgreps      
          })
        }
        return rep_report
    }
