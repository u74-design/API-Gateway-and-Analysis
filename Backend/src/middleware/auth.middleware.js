import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const protectedRoute = async (req,res,next) => {
    try{
        const  token = req.headers.authorization?.split(" ")[1];

        if(!token){
            return res.status(401).json({
                message: "Token not found!",
                success: false,
            })
        }

        const decode = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decode.userId).select("-password");

        if(!user){
             return res.status(401).json({
                message: "User not found",
                success: false
            });
        }

        req.user = user;

        next();
    }catch(err){
        return res.status(401).json({
            message: "Invalid or expired token",
            success: false
        });
    }
}

export {protectedRoute};