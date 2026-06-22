import User from "../models/user.model.js";
import bcrypt from 'bcrypt';
const RegisterUser = async (req,res)=>{
    try{
        const {name, email, password} = req.body;

        if(!name || !password || !email){
            return res.status(400).json({
                message: "All the fields are required!",
                succes: false
            })
        }

        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(409).json({
                message: "User already exists",
                succes: false 
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email,
            password: hashedPassword
        })
        res.status(201).json({
            message: "User registered Successfully",
            success: true
        });
    }catch(err){
        console.log(`Error in Register route working, ${err}`);
        res.status(500).json({
            message:  `Internal Server Error,${err}`,
            succes: false
        })
    }
}

export {RegisterUser};