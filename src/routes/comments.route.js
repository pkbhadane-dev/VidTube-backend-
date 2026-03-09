import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import {
  addComments,
  deleteComment,
  getVideoComments,
  updateComment,
} from "../controllers/comments.controller";

const commentRoute = express.Router();

commentRoute.use(verifyJWT);

commentRoute.route("/:videoId").post(addComments).get(getVideoComments);

commentRoute.route("/c/:commentId").patch(updateComment).delete(deleteComment);

export default commentRoute