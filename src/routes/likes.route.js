import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  commentLike,
  getLikedVideos,
  videoLike,
} from "../controllers/likes.controller.js";

const likesRoute = express.Router();

likesRoute.use(verifyJWT);

likesRoute.route("/v/:videoId").post(videoLike);
likesRoute.route("/c/:commentId").post(commentLike);

likesRoute.route("/videos").get(getLikedVideos);

export default likesRoute