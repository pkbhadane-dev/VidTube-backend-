import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  deleteVideo,
  getAllVideos,
  getVideoById,
  updateVideo,
  uploadVideo,
} from "../controllers/video.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const videoRouter = express.Router();

videoRouter.route("/").get(getAllVideos);
videoRouter.route("/:videoId").get(getVideoById);

videoRouter.use(verifyJWT);

videoRouter.route("/").post(
  upload.fields([
    { name: "videoFile", maxCount: 1 },
    {
      name: "thumbnail",
      maxCount: 1,
    },
  ]),
  uploadVideo,
);

videoRouter
  .route("/:videoId")
  .delete(deleteVideo)
  .patch(upload.single("thumbnail"), updateVideo);

export default videoRouter;
