import express from "express";
import dotenv from "dotenv";
import { clerkMiddleware } from "@clerk/express";
import userRoutes from "./routes/user.route.js";
import adminRoutes from "./routes/admin.route.js";
import songRoutes from "./routes/songs.route.js";
import albumRoutes from "./routes/album.route.js";
import statsRoutes from "./routes/stats.route.js";
import authRoutes from "./routes/auth.route.js";
import { connectDB } from "./lib/db.js";
import cors from "cors";
import fileUpload from "express-fileupload";
import path from "path";
import { createServer } from "http";
import { initializeSocket } from "./lib/socket.js";
const PORT = process.env.PORT || 9000;
dotenv.config();

const app = express();
const __dirname = path.resolve();

const httpServer = createServer(app);

initializeSocket(httpServer);

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(clerkMiddleware()); //* will add auth to all requests
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: path.join(__dirname, "tmp"),
    createParentPath: true,
    limits: { fileSize: 10 * 1024 * 1024 }, //* 10MB max file size
    abortOnLimit: true,
  })
);
app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/songs", songRoutes);
app.use("/api/albums", albumRoutes);
app.use("/api/stats", statsRoutes);

// error handler
app.use((error, _req, res, _next) => {
  console.error(error);
  return res.status(500).json({ message: error.message });
});

httpServer.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  connectDB();
});
