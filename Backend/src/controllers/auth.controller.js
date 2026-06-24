import User from "../models/user.model.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const RegisterUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !password || !email) {
            return res.status(400).json({
                message: "All the fields are required!",
                success: false
            })
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                message: "User already exists",
                success: false
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email,
            password: hashedPassword
        })
        res.status(201).json({
            message: "User registered successsfully",
            successs: true
        });
    } catch (err) {
        console.log(`Error in Register route working, ${err}`);
        res.status(500).json({
            message: `Internal Server Error,${err}`,
            success: false
        })
    }
}

const LoginUser = async (req,res) => {
    try{

        const {email, password} = req.body;

        if(!email || !password){
            return res.status(400).json({
                message: "All fields are required!",
                success: false
            })
        }

        const user = await User.findOne({email});
        
        if(!user){
            return res.status(401).json({
                message: "User not found please Signup",
                success: false
            })
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if(!isPasswordCorrect){
            return res.status(401).json({
                message: "Invalid Password! or email",
                success: false
            })
        }

        const token = jwt.sign(
            {userId : user._id},
            process.env.JWT_SECRET,
            {expiresIn: "7d"}
        );

        return res.status(200).json({
            message: "Login Successful!",
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    }catch (err) {
        console.log(`Error in login route: ${err}`);

        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
}

const GetProfile = async (req,res) => {
    return  res.status(200).json({
        message: "Profile fetched successfully",
        success: true,
        user: req.user
    });
}

export { RegisterUser, LoginUser, GetProfile };