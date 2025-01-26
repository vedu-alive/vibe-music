import { Message } from "../models/message.model.js";
import { User } from "../models/user.model.js";
export const getAllUsers = async (req, res, next) => {
  try {
    const currentUserId = req.auth.userId;
    const users = await User.find({
      clerkId: {
        $ne: currentUserId,
      },
    });
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

export const getMessages = async (req, res, next) => {
  try {
    const currentUserId = req.auth.userId;
    const { userId: receiverUserId } = req.params;
    const messages = await Message.find({
      $or:[
        { senderId: currentUserId, receiverId: receiverUserId },
        { senderId: receiverUserId, receiverId: currentUserId }
      ],
    }).sort({ createdAt: 1 });
    
    res.status(200).json(messages);
  } catch (error) {
    next(error);
  }
};