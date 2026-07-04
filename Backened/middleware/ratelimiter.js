import redisclient from "../src/config/redis";
// Create a function for rate limiting 

export const ratelimiter = async ((req , res) =>{
const user_id  = req.user.id
const key = `rate_limit:${userId}`;
const currentRequest = await redisclient.get(key)


if(!currentRequest){
    await redisclient.set(key , 1)
    await redisclient.expire(key , 60)

   return next()
}

if (Number(currentRequest) >= 5){
     
    return res.json(409).json(
        {success :false ,
         message : "too many requests"
        }
    )}
    await redisclient.incr(key)
    next()
 })