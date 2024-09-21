import { createClient } from "redis";

// Redis client configuration
export const redisClient = createClient({
    url: `redis://default:${process.env.REDIS_PASSWORD || '1234'}@localhost:6379`
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

redisClient.on('connect', () => console.log('Connected to Redis'));

// Connect to the Redis server
(async () => {
    await redisClient.connect();
})();