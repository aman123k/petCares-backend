"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const userSchema_1 = require("../model/userSchema");
const jwtTpken_1 = require("../token/jwtTpken");
const chatConnectionSchema_1 = require("../model/chatConnectionSchema");
const chatSchema_1 = require("../model/chatSchema");
class userChat {
}
_a = userChat;
userChat.chatConnection = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c, _d, _e;
    try {
        const { email } = req.body;
        const token = (_b = req.cookies) === null || _b === void 0 ? void 0 : _b.PetCaresAccessToken;
        const userDetails = (0, jwtTpken_1.verifyToken)(token);
        // Find users
        const user = yield userSchema_1.UserModel.findOne({ email });
        const user2 = yield userSchema_1.UserModel.findOne({
            email: (_c = userDetails === null || userDetails === void 0 ? void 0 : userDetails.user) === null || _c === void 0 ? void 0 : _c.email,
        });
        const existUser = yield chatConnectionSchema_1.ChatConnectionsModel.find({
            $or: [
                {
                    userEmail: [(_d = userDetails === null || userDetails === void 0 ? void 0 : userDetails.user) === null || _d === void 0 ? void 0 : _d.email, email],
                },
                { userEmail: [email, (_e = userDetails === null || userDetails === void 0 ? void 0 : userDetails.user) === null || _e === void 0 ? void 0 : _e.email] },
            ],
        });
        if ((existUser === null || existUser === void 0 ? void 0 : existUser.length) !== 0) {
            return res.status(200).json({
                success: true,
                response: "connection already created",
            });
        }
        const Connection = new chatConnectionSchema_1.ChatConnectionsModel({
            firstUser: {
                username: user === null || user === void 0 ? void 0 : user.username,
                email: user === null || user === void 0 ? void 0 : user.email,
                picture: user === null || user === void 0 ? void 0 : user.picture,
            },
            secondUser: {
                username: user2 === null || user2 === void 0 ? void 0 : user2.username,
                email: user2 === null || user2 === void 0 ? void 0 : user2.email,
                picture: user2 === null || user2 === void 0 ? void 0 : user2.picture,
            },
            isBlock: "",
            userEmail: [user === null || user === void 0 ? void 0 : user.email, user2 === null || user2 === void 0 ? void 0 : user2.email],
            lastMessage: "PetCares: Monitoring adopter-rehouser chat for pet welfare and support",
            time: new Date(),
        });
        yield Connection.save();
        res.status(200).json({
            success: true,
            response: "connection created",
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            response: "Server error",
        });
    }
});
userChat.Sendmessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _f, _g;
    try {
        const { id, message } = req.body;
        const token = (_f = req.cookies) === null || _f === void 0 ? void 0 : _f.PetCaresAccessToken;
        const userDetais = (0, jwtTpken_1.verifyToken)(token);
        const chats = new chatSchema_1.messagesModel({
            sender: (_g = userDetais === null || userDetais === void 0 ? void 0 : userDetais.user) === null || _g === void 0 ? void 0 : _g.email,
            message: message,
            chatId: id,
            time: new Date(),
        });
        const connectionMessage = yield chatConnectionSchema_1.ChatConnectionsModel.findByIdAndUpdate(id, { lastMessage: message, time: new Date() }, { new: true });
        yield (connectionMessage === null || connectionMessage === void 0 ? void 0 : connectionMessage.save());
        yield chats.save();
        res.status(200).json({
            success: true,
            response: " Messages send",
        });
    }
    catch (_h) {
        res.status(500).json({
            success: false,
            response: "Server error",
        });
    }
});
userChat.getChatConnection = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _j, _k, _l;
    try {
        const token = (_j = req.cookies) === null || _j === void 0 ? void 0 : _j.PetCaresAccessToken;
        const userDetais = (0, jwtTpken_1.verifyToken)(token);
        const allConnection = yield chatConnectionSchema_1.ChatConnectionsModel.find({
            $or: [
                {
                    "firstUser.email": (_k = userDetais === null || userDetais === void 0 ? void 0 : userDetais.user) === null || _k === void 0 ? void 0 : _k.email,
                },
                {
                    "secondUser.email": (_l = userDetais === null || userDetais === void 0 ? void 0 : userDetais.user) === null || _l === void 0 ? void 0 : _l.email,
                },
            ],
        });
        res.status(200).json({
            success: true,
            response: allConnection,
        });
    }
    catch (_m) {
        res.status(500).json({
            success: false,
            response: "Server error",
        });
    }
});
userChat.reciveMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.body;
        const allMessage = yield chatSchema_1.messagesModel.find({
            chatId: id,
        });
        let chatdData = {};
        for (const item of allMessage) {
            const { time } = item;
            const day = new Date(time).toLocaleDateString("en-US", {
                day: "2-digit",
                month: "short",
                year: "numeric",
            });
            if (time) {
                if (!chatdData[day]) {
                    chatdData[day] = [];
                }
                chatdData[day].push(item);
            }
        }
        const dataArray = Object.entries(chatdData).map(([day, messages]) => ({
            day,
            messages,
        }));
        res.status(200).json({
            success: true,
            response: dataArray,
            intialmessage: "PetCares: Monitoring adopter-rehouser chat for pet welfare and support",
        });
    }
    catch (_o) {
        res.status(500).json({
            success: false,
            response: "Server error",
        });
    }
});
userChat.deleteChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.body;
        const deleteMessage = yield chatSchema_1.messagesModel.deleteMany({ chatId: id });
        const deleteConnection = yield chatConnectionSchema_1.ChatConnectionsModel.findOneAndDelete({
            _id: id,
        });
        res.status(200).json({
            success: true,
            response: "Chat deleted",
        });
    }
    catch (_p) {
        res.status(500).json({
            success: false,
            response: "Server error",
        });
    }
});
userChat.blockUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, email, name } = req.body;
        const alreayBlock = yield chatConnectionSchema_1.ChatConnectionsModel.findOne({ _id: id });
        if (alreayBlock) {
            if (!(alreayBlock === null || alreayBlock === void 0 ? void 0 : alreayBlock.isBlock.includes(email))) {
                alreayBlock === null || alreayBlock === void 0 ? void 0 : alreayBlock.isBlock.push(email);
                yield (alreayBlock === null || alreayBlock === void 0 ? void 0 : alreayBlock.save());
                res.status(200).json({
                    success: true,
                    response: `you block ${name}`,
                });
            }
            else {
                const newdocs = alreayBlock.isBlock.filter((block) => {
                    return block !== email;
                });
                alreayBlock.isBlock = newdocs;
                yield alreayBlock.save();
                res.status(200).json({
                    success: true,
                    response: `you unblock ${name}`,
                });
            }
        }
    }
    catch (_q) {
        res.status(500).json({
            success: false,
            response: "Server error",
        });
    }
});
exports.default = userChat;
