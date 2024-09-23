import jwt from "jsonwebtoken";
import { removeToken } from "../DB/db.js";

export function createToken(payload) {
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '3d' });

    return token;
}

export function verifyToken(token){
    try{
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        return "valid";

    } catch (e){
        
        // expired token
        if( e instanceof jwt.TokenExpiredError){
            removeToken();
            console.error(`Token expired.`);
            return "expired";
        }

        // invalid format token
        if( e instanceof jwt.JsonWebTokenError){
            console.error(`invalid token format ${token}.`);
            return "invalid";
        }
        console.log(e);
    } 
}