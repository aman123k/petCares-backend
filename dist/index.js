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
(0, dotenv_1.config)();
const app = (0, express_1.default)();
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ limit: "60mb", extended: true }));
app.use((0, cors_1.default)({
    credentials: true,
    origin: String(process.env.RequestPort),
}));
app.use("/", web_1.default);
const DATABASE_URL = String(process.env.DATABASE_URL);
(0, connectDb_1.default)(DATABASE_URL);
const port = parseInt(process.env.PORT || "4000", 10);
const sever = app.listen(port, () => {
    console.log(`server is running on  http://localhost:${port}`);
});
