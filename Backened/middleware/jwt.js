
import jwt from "jsonwebtoken" 

export function create_jwt_token(user) {

    const payload = {
        id :user.id ,
        
        email : user.email
    }
    const token = jwt.sign(
        payload , process.env.SECRET_KEY 
    )
    return token 
}