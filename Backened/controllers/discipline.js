import express from "express"
import { scheduleTable } from "../src/db/schema.js"
import db from "../src/db/index.js"
import { eq } from "drizzle-orm";
async function discipline(email){

    const tasks = await db
        .select({
            is_status_pending: scheduleTable.is_status_pending
        })
        .from(scheduleTable)
        .where(eq(scheduleTable.email, email));

    let completedCount = 0;

    for (const task of tasks) {

        if(task.is_status_pending === false){
            completedCount++;
        }
        console.log(tasks)

    }

    const totalTasks = tasks.length;

    const completionRate =
        totalTasks === 0
        ? 0
        : (completedCount / totalTasks) * 100;

    return {
        totalTasks,
        completedCount,
        completionRate
    };
}

export default discipline 