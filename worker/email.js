import db from "../Backened/src/db/index.js"
import { scheduleTable } from "../Backened/src/db/schema.js"
import { eq } from "drizzle-orm";

const pending_tasks = await db 
.select({
    id:scheduleTable.id ,
    email : scheduleTable.email,
    name:scheduleTable.name ,
    runAT : scheduleTable.runAt ,
    is_status_pending : scheduleTable.is_status_pending ,
    send_email : scheduleTable.send_email ,
    message : scheduleTable.message ,
    title : scheduleTable.title
}).from(scheduleTable).where(eq(scheduleTable.is_status_pending, true))
export default pending_tasks 