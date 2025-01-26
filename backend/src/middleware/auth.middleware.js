import { clerkClient } from "@clerk/express";

export const protectedRoutes = async (req, res, next) => {
  console.log(req, "request");
  const { userId } = req.auth;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};

export const requireAdmin = async (req, res, next) => {
  try {
    const currentUser = await clerkClient.users.getUser(req.auth.userId);
    const isAdmin = (process.env.ADMIN_EMAIL =
      currentUser.primaryEmailAddress.emailAddress);
    if (!isAdmin) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  } catch (error) {
    console.error(error);
    next(error);
  }
};
