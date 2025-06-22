import express, { Request, Response, NextFunction, Application } from "express";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import connectDb from "./db/connectDb";
import web from "./router/web";
import cors from "cors";
import { Server as SocketServer, Socket } from "socket.io";
import client from "./redis/redisConnect";
config();

async function startServer() {
  try {
    const app: Application = express();
    app.get("/status", (req: Request, res: Response) => {
      res.json({ status: "ok" });
    });
    app.use(cookieParser());
    app.use(express.json({ limit: "50mb" }));
    app.use(express.urlencoded({ extended: true, limit: "50mb" }));
    app.use(
      cors({
        credentials: true,
        origin: String(process.env.RequestPort),
      })
    );

    await client.connect();
    app.use("/", web);

    const DATABASE_URL: string = String(process.env.DATABASE_URL);
    connectDb(DATABASE_URL);

    const port: number = parseInt(process.env.PORT || "4000", 10);

    const server = app.listen(port, () => {
      console.log(`server is running on  http://localhost:${port}`);
    });

    const io = new SocketServer(server, {
      pingTimeout: 600000,
      cors: { origin: String(process.env.RequestPort) },
    });

    type User = { user_Id: string; id: string };

    let users: User[] = [];
    const connectedUser = (user_Id: string, id: string) => {
      !users.some((user) => user.user_Id === user_Id) &&
        users.push({ user_Id, id });
    };
    const removeUser = (user_Id: string) => {
      users = users.filter((user) => user.id !== user_Id);
    };

    io.on("connection", (socket: Socket) => {
      socket.on("userConnected", (connectUser: { email: string }) => {
        connectedUser(connectUser.email, socket.id);
        io.emit("onlineUser", users);
      });
      socket.on("joinRoom", (room: string) => {
        socket.join(room);
      });

      socket.on("message", (user) => {
        io.to(user.id).emit("message", user);
      });

      socket.on("disconnect", () => {
        removeUser(socket.id);
        io.emit("onlineUser", users);
      });
    });
  } catch (err) {
    console.log(err);
    console.log("error in start server");
  }
}
startServer();
