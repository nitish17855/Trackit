import fs from "fs";
import csv from "csv-parser";

import db from "../src/db/index.js";
import { exercisesTable } from "../src/db/schema.js";

const exercises = [];

fs.createReadStream("data/megaGymDataset.csv")
  .pipe(csv())
  .on("data", (row) => {

    exercises.push({
      exercise_name: row.Title,
      body_part: row.BodyPart,
      equipment: row.Equipment,
      level : row.Level
    });

  })
  .on("end", async () => {

    try {

      await db
        .insert(exercisesTable)
        .values(exercises);

      console.log("Data imported successfully");

      process.exit(0);

    } catch (err) {

      console.error(err);

      process.exit(1);

    }

  });