import { Request, Response } from "express";
import { UserModel } from "../model/userSchema";
import { verifyToken } from "../token/jwtTpken";
import { userDetails } from "../InterFace/interFace";
import { ChatConnectionsModel } from "../model/chatConnectionSchema";
import { messagesModel } from "../model/chatSchema";
interface GroupedData {
  [time: string]: Message[];
}
interface Message {
  chatId: string;
  message: string;
  sender: string;
  time: string;
  _id: string;
}

class userChat {
  static chatConnection = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      const token = req.cookies?.PetCaresAccessToken;
      const userDetails = verifyToken(token) as userDetails;
      // Find users
      const user = await UserModel.findOne({ email });
      const user2 = await UserModel.findOne({
        email: userDetails?.user?.email,
      });
      const existUser = await ChatConnectionsModel.find({
        $or: [
          {
            userEmail: [userDetails?.user?.email, email],
          },
          { userEmail: [email, userDetails?.user?.email] },
        ],
      });

      if (existUser?.length !== 0) {
        return res.status(200).json({
          success: true,
          response: "connection already created",
        });
      }
      const Connection = new ChatConnectionsModel({
        firstUser: {
          username: user?.username,
          email: user?.email,
          picture: user?.picture,
        },
        secondUser: {
          username: user2?.username,
          email: user2?.email,
          picture: user2?.picture,
        },
        isBlock: "",
        userEmail: [user?.email, user2?.email],
        lastMessage:
          "PetCares: Monitoring adopter-rehouser chat for pet welfare and support",
        time: new Date(),
      });
      await Connection.save();
      res.status(200).json({
        success: true,
        response: "connection created",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        response: "Server error",
      });
    }
  };
  static Sendmessages = async (req: Request, res: Response) => {
    try {
      const { id, message } = req.body;
      const token = req.cookies?.PetCaresAccessToken;
      const userDetais = verifyToken(token) as userDetails;
      const chats = new messagesModel({
        sender: userDetais?.user?.email,
        message: message,
        chatId: id,
        time: new Date(),
      });
      const connectionMessage = await ChatConnectionsModel.findByIdAndUpdate(
        id,
        { lastMessage: message, time: new Date() },
        { new: true }
      );
      await connectionMessage?.save();
      await chats.save();
      res.status(200).json({
        success: true,
        response: " Messages send",
      });
    } catch {
      res.status(500).json({
        success: false,
        response: "Server error",
      });
    }
  };
  static getChatConnection = async (req: Request, res: Response) => {
    try {
      const token = req.cookies?.PetCaresAccessToken;
      const userDetais = verifyToken(token) as userDetails;
      const allConnection = await ChatConnectionsModel.find({
        $or: [
          {
            "firstUser.email": userDetais?.user?.email,
          },
          {
            "secondUser.email": userDetais?.user?.email,
          },
        ],
      });

      res.status(200).json({
        success: true,
        response: allConnection,
      });
    } catch {
      res.status(500).json({
        success: false,
        response: "Server error",
      });
    }
  };
  static reciveMessage = async (req: Request, res: Response) => {
    try {
      const { id } = req.body;
      const allMessage: Array<Message> = await messagesModel.find({
        chatId: id,
      });
      let chatdData: GroupedData = {};

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
        intialmessage:
          "PetCares: Monitoring adopter-rehouser chat for pet welfare and support",
      });
    } catch {
      res.status(500).json({
        success: false,
        response: "Server error",
      });
    }
  };

  static deleteChat = async (req: Request, res: Response) => {
    try {
      const { id } = req.body;

      const deleteMessage = await messagesModel.deleteMany({ chatId: id });
      const deleteConnection = await ChatConnectionsModel.findOneAndDelete({
        _id: id,
      });
      res.status(200).json({
        success: true,
        response: "Chat deleted",
      });
    } catch {
      res.status(500).json({
        success: false,
        response: "Server error",
      });
    }
  };
  static blockUser = async (req: Request, res: Response) => {
    try {
      const { id, email, name } = req.body;
      const alreayBlock = await ChatConnectionsModel.findOne({ _id: id });
      if (alreayBlock) {
        if (!alreayBlock?.isBlock.includes(email)) {
          alreayBlock?.isBlock.push(email);
          await alreayBlock?.save();
          res.status(200).json({
            success: true,
            response: `you block ${name}`,
          });
        } else {
          const newdocs = alreayBlock.isBlock.filter((block) => {
            return block !== email;
          });
          alreayBlock.isBlock = newdocs;
          await alreayBlock.save();
          res.status(200).json({
            success: true,
            response: `you unblock ${name}`,
          });
        }
      }
    } catch {
      res.status(500).json({
        success: false,
        response: "Server error",
      });
    }
  };
}

export default userChat;
