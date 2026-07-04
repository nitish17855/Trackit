import express from "express"
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat.js";
import { scheduleTable } from "../src/db/schema.js";
import db from "../src/db/index.js"
import { eq } from "drizzle-orm";

dayjs.extend(customParseFormat);


const router = express.Router()

router.post("/schedule_task" , async(req , res)=> {
    const {name , title , message , runAt} = req.body

   const user_date = dayjs(
     runAt ,
    "DD/MM/YYYY h:mm A"
    ).toDate();
    
    const [user] = await db 
    .insert(scheduleTable)
    .values({
        name ,
        title  ,
        runAt : user_date
    }).returning({id : scheduleTable.id})

  res.status(201).json({
    message: "scheduled",
    id: user.id
})
console.log(runAt)
console.log(user_date)
   
})
export default router 