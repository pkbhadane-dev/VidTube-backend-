import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  addVideoToPlaylist,
  createPlaylist,
  deletePlaylist,
  getPlaylistById,
  getUserPlaylists,
  removeVideoFromPlaylist,
  updatePlaylist,
} from "../controllers/playlist.controller.js";

const playlistRoute = express.Router();

playlistRoute.use(verifyJWT);

playlistRoute.route("/").post(createPlaylist);

playlistRoute.route("/add/:playlistId/:videoId").patch(addVideoToPlaylist);
playlistRoute
  .route("/remove/:videoId/:playlistId")
  .patch(removeVideoFromPlaylist);

playlistRoute.route("/user/:userId").get(getUserPlaylists);

playlistRoute
  .route("/:playlistId")
  .get(getPlaylistById)
  .patch(updatePlaylist)
  .delete(deletePlaylist);

  export default playlistRoute