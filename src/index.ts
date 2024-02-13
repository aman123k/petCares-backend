import express, { Request, Response, NextFunction, Application } from "express";
import { Server } from "http";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import connectDb from "./db/connectDb";
import web from "./router/web";
import cors from "cors";
config();

const app: Application = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ limit: "60mb", extended: true }));
app.use(
  cors({
    credentials: true,
    origin: String(process.env.RequestPort),
  })
);

app.use("/", web);

const DATABASE_URL: string = String(process.env.DATABASE_URL);
connectDb(DATABASE_URL);

const port: number = parseInt(process.env.PORT || "4000", 10);

const sever: Server = app.listen(port, () => {
  console.log(`server is running on  http://localhost:${port}`);
});
