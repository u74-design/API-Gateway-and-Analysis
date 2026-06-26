import axios from "axios";
import Api from "../models/api.model.js";
import redis from "../config/redis.js";
import Analytics from "../models/analytics.model.js";

const handleProxyRequest = async (req, res) => {
    try {
        const { proxyId } = req.params;

        const api = await Api.findOne({ proxyId });

        if (!api) {
            return res.status(404).json({
                message: "API not found",
                success: false
            });
        }

        const clientIp = req.ip;


        const redisKey = `rateLimit:${proxyId}:${clientIp}`;

        const CurrentCount = await redis.incr(redisKey);

        if (CurrentCount === 1) {
            await redis.expire(redisKey, 60);
        }

        if (CurrentCount > api.rateLimit) {
            await Analytics.create({
                apiId: api._id,
                owner: api.owner,
                proxyId: api.proxyId,
                clientIp,
                statusCode: 429,
                latency: 0,
                blocked: true
            })
            return res.status(429).json({
                message: "Rate limit exceeded",
                success: false
            });
        }
        const startTime = Date.now();

        const response = await axios.get(api.originalUrl);

        const endTime = Date.now();
        const apiLatency = endTime - startTime;

        await Analytics.create({
            apiId: api._id,
            owner: api.owner,
            proxyId: api.proxyId,
            clientIp,
            statusCode: response.status,
            latency: apiLatency,
            blocked: false
        });

        return res.status(200).json({
            success: true,
            apiLatency,
            data: response.data
        });
    } catch (err) {
        console.log("Proxy error:", err.message);

        return res.status(500).json({
            message: "Error while forwarding request",
            success: false
        });
    }
}

export { handleProxyRequest };