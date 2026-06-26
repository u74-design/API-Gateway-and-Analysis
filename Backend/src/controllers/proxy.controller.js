import axios from "axios";
import Api from "../models/api.model.js";
import redis from "../config/redis.js";
import Analytics from "../models/analytics.model.js";
import parseWindow from "../utils/windowParser.js";

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

        const apiKey = req.headers["x-api-key"];

        if (!apiKey) {
            return res.status(401).json({
                message: "API key is required",
                success: false
            });
        }

        if (apiKey !== api.apiKey) {
            return res.status(401).json({
                message: "Invalid API key",
                success: false
            });
        }

        const clientIp = req.ip;

        // 1. Rate limit check
        const redisKey = `rateLimit:${proxyId}:${clientIp}`;
        const currentCount = await redis.incr(redisKey);

        const expireTime = parseWindow(api.window);

        if (currentCount === 1) {
            await redis.expire(redisKey, expireTime);
        }

        if (currentCount > api.rateLimit) {
            await Analytics.create({
                apiId: api._id,
                owner: api.owner,
                proxyId: api.proxyId,
                clientIp,
                statusCode: 429,
                latency: 0,
                blocked: true,
                source: "rate_limit"
            });

            return res.status(429).json({
                message: "Rate limit exceeded",
                success: false
            });
        }

        // 2. Cache check
        const cacheKey = `cache:${proxyId}`;
        const cacheStart = Date.now();

        const cachedResponse = await redis.get(cacheKey);

        if (cachedResponse) {
            const cacheLatency = Date.now() - cacheStart;

            console.log("CACHE HIT");

            await Analytics.create({
                apiId: api._id,
                owner: api.owner,
                proxyId: api.proxyId,
                clientIp,
                statusCode: 200,
                latency: cacheLatency,
                blocked: false,
                source: "cache"
            });

            return res.status(200).json({
                success: true,
                source: "cache",
                cacheLatency,
                data: JSON.parse(cachedResponse)
            });
        }

        console.log("CACHE MISS");

        // 3. Call original API
        const startTime = Date.now();

        const response = await axios.get(api.originalUrl);

        const endTime = Date.now();
        const apiLatency = endTime - startTime;

        // 4. Store response in cache
        await redis.set(
            cacheKey,
            JSON.stringify(response.data),
            "EX",
            60
        );

        // 5. Store analytics
        await Analytics.create({
            apiId: api._id,
            owner: api.owner,
            proxyId: api.proxyId,
            clientIp,
            statusCode: response.status,
            latency: apiLatency,
            blocked: false,
            source: "api"
        });

        return res.status(200).json({
            success: true,
            source: "api",
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
};

export { handleProxyRequest };