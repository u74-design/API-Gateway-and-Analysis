import Api from "../models/api.model.js";
import crypto from  "crypto";
const RegisterApi = async (req, res) => {
    try {
        const { name, originalUrl, rateLimit, window } = req.body;

        if (!name || !originalUrl || !rateLimit) {
            return res.status(400).json({
                message: "Name, originalUrl and rateLimit are required",
                success: false
            });
        }

        const proxyId = crypto.randomUUID();

        const api = await Api.create({
            name,
            originalUrl,
            rateLimit,
            window: window || "1m",
            proxyId,
            owner: req.user._id
        });

        return res.status(201).json({
            message: "API registered successfully",
            success: true,
            api
        });

    } catch (err) {
        console.log("Error in RegisterApi:", err);

        return res.status(500).json({
            message: "Error in registering the API",
            success: false
        });
    }
};


const GetmyApis = async (req,res) => {
    try{
        const apis = await Api.find({owner: req.user._id}).sort({createdAt: -1});
        return res.status(200).json({
            message: "Api fetch Successfuly!",
            success: true,
            apis
        })
    }catch(err){
        return res.status(500).json({
            message: "Error in fetching APIs",
            success: false
        });
    }
}

export { RegisterApi, GetmyApis };