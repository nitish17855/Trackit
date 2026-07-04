import jwt from "jsonwebtoken"

export const ensure_authenticated = function(req , res , next) {
   
    const auth = req.headers.authorization

    if(!auth){
        return res.status(401).json({message : 'Please sign in first'});
    }
    const token = auth.split(" ")[1]
   try{
     
    const decode = jwt.verify(token , process.env.SECRET_KEY)
    req.user = decode
    next()
   }
   catch(err){
    console.log(err.name , err.message)
    return res.status(401).json({message :"Your session has expired. Please sign in again."})

   }
}
