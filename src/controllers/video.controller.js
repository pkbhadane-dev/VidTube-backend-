import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { User } from "../models/user.model.js";
import { Like } from "../models/likes.model.js";

export const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;

  if (userId && !isValidObjectId(userId)) {
    throw new ApiError(400, "invalid userId");
  }

  const allVideos = Video.aggregate([
    {
      $match: {
        $and: [
          query ? { title: { $regex: query, $options: "i" } } : {},
          userId ? { owner: new mongoose.Types.ObjectId(userId) } : {},
        ],
      },
    },
    {
      $sort: {
        [sortBy || "createdAt"]: sortType?.toLowerCase() === "desc" ? -1 : 1,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "ownerDetail",
        pipeline: [
          {
            $project: {
              username: 1,
              avatar: 1,
              subscribersCount: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        owner: {
          $first: "$ownerDetail",
        },
      },
    },
  ]);

  const option = {
    page,
    limit,
  };

  const filterAllVideos = await Video.aggregatePaginate(allVideos, option);

  return res
    .status(200)
    .json(
      new ApiResponse(200, filterAllVideos, "All videos fetched successfully"),
    );
});

export const uploadVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  const userId = req.user._id;
  if (!title || !description) {
    throw new ApiError(400, "Title & Description are required");
  }

  const localVideoPath = req.files.videoFile[0]?.path;
  const localThumbnailPath = req.files.thumbnail[0]?.path;

  if (!localThumbnailPath || !localVideoPath) {
    throw new ApiError(400, "Video and Thumbnail are required");
  }

  const video = await uploadOnCloudinary(localVideoPath);
  const thumbnail = await uploadOnCloudinary(localThumbnailPath);

  if (!video || !thumbnail) {
      throw new ApiError(500, "Failed to upload video or thumbnail to Cloudinary");
    }

  const uploadVideo = await Video.create({
    title,
    description,
    videoFile: video.url,
    thumbnail: thumbnail.url,
    owner: userId,
    duration: video.duration,
  });

  const fullVideoDetails = await Video.findById(uploadVideo._id).populate("owner", "fullname avatar")

  return res
    .status(200)
    .json(new ApiResponse(200, fullVideoDetails.toObject(), "Video upload successfully"));
});

export const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const userId = req.user?._id;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "VideoId is required");
  }

  await Video.findByIdAndUpdate(videoId, {
    $inc: { views: 1 },
  });

  const video = await Video.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(videoId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
        pipeline: [
          {
            $project: {
              fullname: 1,
              username: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "video",
        as: "likes",
      },
    },
    {
      $addFields: {
        owner: {
          $first: "$owner",
        },
        likesCount: {
          $size: "$likes",
        },
        isLiked: {
          $cond: {
            if: {
              $in: [new mongoose.Types.ObjectId(userId), "$likes.likedBy"],
            },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        likes: 0,
      },
    },
  ]);

  if (userId) {
    await User.findByIdAndUpdate(
      userId,
      {
        $addToSet: {
          watchHistory: videoId,
        },
      },
      {
        new: true,
      },
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, video[0], "Video fetched successfully"));
});

export const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { title, description } = req.body;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "invalid videoId");
  }

  let thumbnail;

  if (req.file && req.file.thumbnail[0].path) {
    const localThumbnailPath = req.file.thumbnail[0].path;
    thumbnail = await uploadOnCloudinary(localThumbnailPath);
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "video not found");
  }

  if (video.owner.toString() !== req.user?._id.toString()) {
    throw new ApiError(400, "you are not authorised to delete this video");
  }

  const updateVideo = await Video.findByIdAndUpdate(
    videoId,
    {
      $set: {
        title,
        description,
        thumbnail: thumbnail?.url,
      },
    },
    { new: true },
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updateVideo, "Video updated successfully"));
});

export const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "VideoId is required");
  }

  const video = await Video.findById(videoId);

  if (video.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(400, "you are not authorized to delete this video");
  }

  await Video.findByIdAndDelete(videoId);

  return res.status(200).json(new ApiResponse(200, {}, "Video deleted"));
});
