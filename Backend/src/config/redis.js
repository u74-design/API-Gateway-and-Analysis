import Redis from "ioredis";

const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
    throw new Error("REDIS_URL is missing. Add the Upstash rediss:// connection string to Backend/.env");
}

const redis = new Redis(redisUrl);
redis.on("connect",()=>{
    console.log("Redis Connected Successfuly!");
})

redis.on("error", (err) => {
    console.log("Redis connection error full:", err);
    console.log("Redis error message:", err.message);
    console.log("Redis error code:", err.code);
});

export default redis;
