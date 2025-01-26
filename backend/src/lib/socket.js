import { Server } from "socket.io";
import { Message } from "../models/message.model.js";

export const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });
  const userSockets = new Map(); //* {userId: socketId}
  const userActivities = new Map(); //* {userId: activity}
  const userIdToSocketIdMap = new Map(); //* {userId: roomId}
  const socketidToUserIdlMap = new Map(); //* {roomId: userId}
  io.on("connection", (socket) => {
    socket.on("user_connected", (userId) => {
      userSockets.set(userId, socket.id);
      userActivities.set(userId, "Idle");

      //* broadcast to all users that this user has connected
      io.emit("user_connected", userId);

      //* send the list of online users to the newly connected user and also their activities
      socket.emit("users_online", Array.from(userSockets.keys()));
      socket.emit("activities", Array.from(userActivities.entries()));
    });

    socket.on("update_activity", ({ userId, activity }) => {
      console.log("updated activity", userId, activity);
      userActivities.set(userId, activity);
      io.emit("activity_updated", { userId, activity });
    });

    socket.on("send_message", async (data) => {
      try {
        const { senderId, receiverId, content } = data;
        const message = await Message.create({
          senderId,
          receiverId,
          content,
        });

        //* send message to the receiver if they're online
        const receiverSocketId = userSockets.get(receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("new_message", message);
        }
        //* send feedback message to the sender
        socket.emit("message_sent", message);
      } catch (error) {
        console.error("message_error", error);
        socket.emit("message_error", error.message);
      }
    });

    socket.on("initiate-video-call", async ({ callerId, userId, offer, callerName }) => {
      try {
        userIdToSocketIdMap.set(callerId, socket.id);
        socketidToUserIdlMap.set(socket.id, callerId);
        const receiverSocketId = userSockets.get(userId);

        if (!receiverSocketId) {
          throw new Error("User is not online");
        }

        io.to(socket.id).emit("initiate-video-call", receiverSocketId);

        io.to(receiverSocketId).emit("incomming-call", {
          from: socket.id,
          offer,
          callerName, 
        });
      } catch (error) {
        socket.emit("video-call-error", error.message);
      }
    });
      
    socket.on("call-accepted", async ({ to, answer }) => {
      try {
        io.to(to).emit("call-accepted", {
          from: socket.id,
          answer,
        });
      } catch (error) {}
    });

    socket.on("call-negotiation", async ({ to, offer }) => {
      io.to(to).emit('call-negotiation', {from : socket.id, offer}); 
    });

    socket.on("call-negotiation-done", async ({ to, answer }) => {
      io.to(to).emit("call-negotiation-final", { from: socket.id, answer });
    });

    socket.on("disconnect", () => {
      let disconnectedUserId;
      for (const [userId, socketId] of userSockets.entries()) {
        //* find the user that disconnected
        if (socketId === socket.id) {
          disconnectedUserId = userId;
          userSockets.delete(userId);
          userActivities.delete(userId);
          break;
        }
      }
      if (disconnectedUserId) {
        io.emit("user_disconnected", disconnectedUserId);
      }
    });
  });
};
