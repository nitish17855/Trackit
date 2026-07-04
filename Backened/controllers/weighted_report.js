import { workoutTable } from "../src/db/schema.js";
import { min, max, avg, and, eq } from "drizzle-orm";
import db from "../src/db/index.js"

export async function weighted_report(email) {

    const exercises = await db
        .selectDistinct({
            exercise: workoutTable.exercise_name
        })
        .from(workoutTable);

    const weight_report = [];

    for (const exercise of exercises) {

        const weight = await db
            .select({
                minWeight: min(workoutTable.weight),
                maxWeight: max(workoutTable.weight),
                avgWeight: avg(workoutTable.weight)
            })
            .from(workoutTable)
            .where(
                and(
                    eq(workoutTable.email, email),
                    eq(workoutTable.exercise_name, exercise.exercise)
                )
            );

        weight_report.push({
            exercise: exercise.exercise,
            minWeight: weight[0]?.minWeight,
            maxWeight: weight[0]?.maxWeight,
            avgWeight: weight[0]?.avgWeight
        });
    }

    return weight_report;
}

export default weighted_report;