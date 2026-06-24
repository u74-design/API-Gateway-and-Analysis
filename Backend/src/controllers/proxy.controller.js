import axios from "axios";
import Api from "../models/api.model.js";

const handleProxyRequest = async(req,res) => {
    try{
        const {proxyId} = req.params;

        const api = await Api.findOne({proxyId});

        if(!api){
            return res.status(404).json({
                message: "API not found",
                success: false
            });  
        }

        const startTime = Date.now();

        const response = await axios.get(api.originalUrl);

        const endTime = Date.now();
        const apiLatency = endTime - startTime;

        return  res.status(200).json({
            success: true,
            apiLatency,
            data: response.data
        });
    }catch (err) {
        console.log("Proxy error:", err.message);

        return res.status(500).json({
            message: "Error while forwarding request",
            success: false
        });
    }
}

export {handleProxyRequest};