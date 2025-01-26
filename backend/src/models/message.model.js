import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    senderId: {
        type: String, //* This is the user's clerkId
        required: true,
    },
    receiverId: {
        type: String, //* This is the user's clerkId
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
}, { timestamps: true });
export const Message = mongoose.model("Message", messageSchema);