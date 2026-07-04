import express from "express"
import  { usersTable } from "../src/db/schema.js"
import db from "../src/db/index.js"
import { eq } from "drizzle-orm";
import { loginratelimiter } from "../middleware/loginratelimiter.js";

const router = express.Router()
 // GET THE BODY
 // VERIFY IF USER PREEXIST OR NOT
 // IF A NEW EMAIL REGISTER HIM
router.post("/signup" , loginratelimiter, async(req,res) => {
    const { name , email , password , age, weight } = req.body
    
    const[existing_user] = await db 
    .select({
        email : usersTable.email
    }).from(usersTable).where(eq(usersTable.email , email))
    

    if(existing_user){
        return res.status(409).json({error : "User already exists"})
    }

    const[user] = await db
    .insert(usersTable).
    values({ 
        name,
        email,
        password,
        weight,
        age,


    }).returning({user_Id : usersTable.id})

    res.status(200).json({message : "success"})
    

})
 
export default router ;
