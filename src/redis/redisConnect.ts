import { createClient, RedisClientOptions } from "redis";
import { config } from "dotenv";
config();

const client = createClient({
  password: String(process.env.REDIS_PASSWORD),
  socket: {
    host: process.env.REDIS_HOST,
    port: 14951,
  },
});

client.on("connect", () => {
  console.log("Connected to Redis");
});

client.on("error", (err) => {
  console.error("Error connecting to Redis:", err);
});

export default client;
