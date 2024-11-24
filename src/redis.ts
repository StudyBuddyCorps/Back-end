import { createClient } from "redis";

const redisClient = createClient({
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_ENDPOINT,
    port: 16653,
    connectTimeout: 20000,
  },
});

async function connectToRedis() {
  try {
    await redisClient.connect();
    console.log("Redis connected!");
  } catch (error) {
    console.log("Redis Client Error", error);
  }
}

connectToRedis();

export default redisClient;
