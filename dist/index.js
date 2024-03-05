"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = require("dotenv");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const connectDb_1 = __importDefault(require("./db/connectDb"));
const web_1 = __importDefault(require("./router/web"));
const cors_1 = __importDefault(require("cors"));
const socket_io_1 = require("socket.io");
(0, dotenv_1.config)();
const app = (0, express_1.default)();
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json({ limit: "10mb" }));
app.use(express_1.default.urlencoded({ extended: true, limit: "10mb" }));
app.use((0, cors_1.default)({
    credentials: true,
    origin: String(process.env.RequestPort),
}));
app.use("/", web_1.default);
const DATABASE_URL = String(process.env.DATABASE_URL);
(0, connectDb_1.default)(DATABASE_URL);
const port = parseInt(process.env.PORT || "4000", 10);
const server = app.listen(port, () => {
    console.log(`server is running on  http://localhost:${port}`);
});
const io = new socket_io_1.Server(server, {
    pingTimeout: 600000,
    cors: { origin: String(process.env.RequestPort) },
});
let users = [];
const connectedUser = (user_Id, id) => {
    !users.some((user) => user.user_Id === user_Id) &&
        users.push({ user_Id, id });
};
const removeUser = (user_Id) => {
    users = users.filter((user) => user.id !== user_Id);
};
io.on("connection", (socket) => {
    socket.on("userConnected", (connetUser) => {
        console.log("connect user");
        connectedUser(connetUser.email, socket.id);
        io.emit("onlineUser", users);
    });
    socket.on("joinRoom", (room) => {
        socket.join(room);
    });
    socket.on("message", (user) => {
        io.to(user.id).emit("message", user);
    });
    socket.on("disconnect", () => {
        console.log("disconnect");
        removeUser(socket.id);
        io.emit("onlineUser", users);
    });
});
