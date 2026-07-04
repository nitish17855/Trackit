import express from "express"
import  { usersTable } from "../src/db/schema.js"
import db from "../src/db/index.js"
import { eq } from "drizzle-orm";
import {create_jwt_token }from "../middleware/jwt.js"
import { ensure_authenticated } from "../middleware/verify_token.js";
import { loginratelimiter } from "../middleware/loginratelimiter.js";
// Get the request body 
// find if user exist or not
// if not exist ask him to signup
// if exist generate a jwt

const router = express.Router()

router.post("/login" , loginratelimiter, async(req,res) => {
 const{  email , password} = req.body 

 const[existing_user] = await db
  .select({
    id : usersTable.id ,
    
    email : usersTable.email,
    name: usersTable.name,
    password: usersTable.password

  }).from(usersTable).where(eq(usersTable.email , email))

 if(!existing_user){
   return  res.status(400).json({error : "user not registered "});
  }
 if(existing_user.password !== password) return res.status(401).json({ error: "Invalid email or password" });
 const token = create_jwt_token(existing_user)
 return  res.status(200).json({token, user: { name: existing_user.name, email: existing_user.email } })
  
})
export default router ;
