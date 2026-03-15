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

videoRouter.use(verifyJWT);

videoRouter
  .route("/")
  .get(getAllVideos)
  .post(
    upload.fields([
      { name: "video", maxCount: 1 },
      {
        name: "thumbnail",
        maxCount: 1,
      },
    ]),
    uploadVideo,
  );

videoRouter
  .route("/:videoId")
  .get(getVideoById)
  .delete(deleteVideo)
  .patch(upload.single("thumbnail"), updateVideo);

  export default videoRouter