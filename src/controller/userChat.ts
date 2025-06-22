import { Request, Response } from "express";
import { UserModel } from "../model/userSchema";
import { verifyToken } from "../token/jwtToken";
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
  // Create chat connection
  static chatConnection = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      const token = req.cookies?.PetCaresAccessToken;
      const userDetails = verifyToken(token) as userDetails;
      // Find users
      const firstUser = await UserModel.findOne({ email });
      const secondUser = await UserModel.findOne({
        email: userDetails?.user?.email,
      });

      const existUser = await ChatConnectionsModel.find({
        $and: [
          {
            firstUser: firstUser,
          },
          { secondUser: secondUser },
        ],
      });

      if (existUser?.length !== 0) {
        return res.status(200).json({
          success: true,
          response: "connection already created",
        });
      }
      const Connection = new ChatConnectionsModel({
        firstUser: firstUser,
        secondUser: secondUser,
        isBlock: [],
        userEmail: [firstUser?.email, secondUser?.email],
        lastMessage:
          "PetCares: Monitoring adopter-rehouse chat for pet welfare and support",
        time: new Date(),
      });
      await Connection.save();
      res.status(200).json({
        success: true,
        response: "connection created",
      });
    } catch (error) {
      console.log("chat connection error", error);
      res.status(500).json({
        success: false,
        response: "Server error",
      });
    }
  };

  //get ChatConnection
  static getChatConnection = async (req: Request, res: Response) => {
    try {
      const token = req.cookies?.PetCaresAccessToken;
      const userDetails = verifyToken(token) as userDetails;
      const id = userDetails?.user?._id;
      const allConnection = await ChatConnectionsModel.find({
        $or: [
          {
            firstUser: id,
          },
          {
            secondUser: id,
          },
        ],
      })
        .populate({
          path: "firstUser",
          select: "-password -registerType -loginType",
        })
        .populate({
          path: "secondUser",
          select: "-password -registerType -loginType",
        });

      res.status(200).json({
        success: true,
        response: allConnection,
      });
    } catch (err) {
      console.log("get connection error", err);
      res.status(500).json({
        success: false,
        response: "Server error",
      });
    }
  };
  // Send Message fun
  static SendMessages = async (req: Request, res: Response) => {
    try {
      const { id, message } = req.body;
      const token = req.cookies?.PetCaresAccessToken;
      const userDetails = verifyToken(token) as userDetails;
      const chats = new messagesModel({
        sender: userDetails?.user?.email,
        message: message,
        chatId: id,
        time: new Date(),
      });
      await ChatConnectionsModel.findByIdAndUpdate(
        id,
        { lastMessage: message, time: new Date() },
        { new: true }
      );
      await chats.save();
      res.status(200).json({
        success: true,
        response: "Messages send",
      });
    } catch (err) {
      console.log("send messages error", err);
      res.status(500).json({
        success: false,
        response: "Server error",
      });
    }
  };

  static receiveMessage = async (req: Request, res: Response) => {
    try {
      const { id } = req.body;
      const allMessage: Array<Message> = await messagesModel.find({
        chatId: id,
      });
      let chatsData: GroupedData = {};

      for (const item of allMessage) {
        const { time } = item;

        const day = new Date(time).toLocaleDateString("en-US", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
        if (time) {
          if (!chatsData[day]) {
            chatsData[day] = [];
          }
          chatsData[day].push(item);
        }
      }
      const dataArray = Object.entries(chatsData).map(([day, messages]) => ({
        day,
        messages,
      }));
      res.status(200).json({
        success: true,
        response: dataArray,
        initialMessage:
          "PetCares: Monitoring adopter-rehouses chat for pet welfare and support",
      });
    } catch (err) {
      console.log("receive messages err", err);
      res.status(500).json({
        success: false,
        response: "Server error",
      });
    }
  };
  // Chat Delete
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
    } catch (err) {
      console.log("delete chat", err);
      res.status(500).json({
        success: false,
        response: "Server error",
      });
    }
  };
  // User Block
  static blockUser = async (req: Request, res: Response) => {
    try {
      const { id, email, name } = req.body;
      const alreadyBlock = await ChatConnectionsModel.findOne({ _id: id });

      if (!alreadyBlock?.isBlock.includes(email)) {
        alreadyBlock?.isBlock.push(email);
        await alreadyBlock?.save();
        res.status(200).json({
          success: true,
          response: `You block ${name}`,
        });
      } else {
        const newDocs = alreadyBlock.isBlock.filter((block) => {
          return block !== email;
        });
        alreadyBlock.isBlock = newDocs;
        await alreadyBlock.save();
        res.status(200).json({
          success: true,
          response: `You unblock ${name}`,
        });
      }
    } catch (err) {
      console.log("block user", err);
      res.status(500).json({
        success: false,
        response: "Server error",
      });
    }
  };
}

export default userChat;
