import { createClient, RedisClientOptions } from "redis";
import { config } from "dotenv";
config();
const client = createClient({
  port: process.env.REDIS_PORT,
  host: process.env.REDIS_HOST,
} as RedisClientOptions);
client.on("error", (err) => console.log("Redis Client Error", err));
client.connect();

export default client;
