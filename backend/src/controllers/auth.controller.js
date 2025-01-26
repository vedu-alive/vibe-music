import { User } from "../models/user.model.js";

export const authCallback = async (req, res,next) => {
  try {
    const { id, firstName, lastName, imageUrl } = req.body;
    //* if User already exists;
    const user = await User.findOne({ clerkId: id });
    if (!user) {
      //* signup
      await User.create({
        clerkId: id,
        fullName: `${firstName || ""} ${lastName || ""}`.trim(),
        imageUrl,
      });
    }
    res.status(200).json({ message: "User signed in successfully" });
  } catch (error) {
   next(error);
  }
};