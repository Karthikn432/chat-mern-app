import jwt from 'jsonwebtoken'
import User from '../models/user.model.js';

export const protectRoute = async (req, res, next) => {
    try {
        console.log({req})
        const token = req.cookies.jwt;
        console.log({token})
        if(!token){
            return res.status(401).json({error : "Unauthorized - No Token Provided!"});
        }

        const decoded = jwt.verify(token, process.env.JWt_SECRET || "pnVZz3KAOAmGwyfiaeo13IdqgPJQU5KTphO2vhuURd4=");

        if(!decoded) {
            return res.status(401).json({error : "Unauthorized - Invalid Token"})
        }

        const user = await User.findById(decoded.userId).select("-passowrd")

        if(!user){
            return res.status(400).json({error : "User not found"})
        }

        req.user = user;

        next();
        
    } catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({ error: "Internal Server Error" }) 
    }
} 

