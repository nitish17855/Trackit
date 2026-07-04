import redisclient from "../src/config/redis.js";

export const loginratelimiter = async (req, res, next) => {

    const ip = req.ip;
    const key = `login_attempt:${ip}`;

    const attempts = await redisclient.incr(key);

    if (attempts === 1) {
        await redisclient.expire(key, 60);
    }

    if (attempts > 5) {
        const retryafter = await redisclient.ttl(key);

        return res.status(429).json({
            success: false,
            message: "Too many requests",
            retryafter
        });
    }

    next();
};