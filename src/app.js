import cookieParser from "cookie-parser";
import cors from "cors";
import express, { json, urlencoded } from "express";
import userRouter from "./routes/user.route.js";
import videoRouter from "./routes/video.route.js";
import subscriptionRoute from "./routes/subscription.route.js";
import playlistRoute from "./routes/playlist.route.js";
import likesRoute from "./routes/likes.route.js";
import dashboardRoute from "./routes/dashboard.route.js";
import commentRoute from "./routes/comments.route.js";
import { catchError } from "./middlewares/errorHandling.middleware.js";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());
app.use(express.static("public"));
app.use(urlencoded({ extended: true }));

app.use("/api/v1/user", userRouter);
app.use("/api/v1/video", videoRouter);
app.use("/api/v1/subscription", subscriptionRoute);
app.use("/api/v1/playlist", playlistRoute);
app.use("/api/v1/likes", likesRoute);
app.use("/api/v1/dashboard", dashboardRoute);
app.use("/api/v1/comments", commentRoute);

app.use(catchError)

export default app;
