import mongoose, { isValidObjectId } from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Comment } from "../models/comments.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";


export const addComments = asyncHandler(async (req, res) => {
  const { comment } = req.body;
  const { videoId } = req.params;
  const userId = req.user?._id;

  

  if (!comment) {
    throw new ApiError(400, "comment is required");
  }
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "invalid videoId");
  }

  const comments = await Comment.create({
    comment,
    video: videoId,
    owner: userId,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, comments, "comment added successfully"));
});

export const getVideoComments = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { page = 1, limit = 10, sortBy, sortType } = req.query;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid videoId");
  }

  const pipelines = Comment.aggregate([
    {
      $match: {
        video: new mongoose.Types.ObjectId(videoId),
      },
    },
    {
      $sort: {
        [sortBy || "createdAt"]: sortType === "desc" ? -1 : 1,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "ownerDetails",
        pipeline: [
          {
            $project: {
              username: 1,
              avatar: 1,
              fullname: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        ownerDetails: {
          $first: "$ownerDetails",
        },
      },
    },
  ]);

  const option = {
    page,
    limit,
  };

  const getVideoComments = await Comment.aggregatePaginate(pipelines, option);

  return res
    .status(200)
    .json(new ApiResponse(200, getVideoComments, "video comments fetched"));
});

export const updateComment = asyncHandler(async (req, res) => {
  const { comment } = req.body;
  const { commentId } = req.params;
  const userId = req.user._id;

  if (!isValidObjectId(commentId)) {
    throw new ApiError(400, "invalid commentId");
  }

  const comments = await Comment.findById(commentId);

  if (comments.owner.toString() !== userId?.toString()) {
    throw new ApiError(400, "you are not authorized to update the comment");
  }

  const updatedComment = await Comment.findByIdAndUpdate(
    commentId,
    {
      $set: {
        comment,
      },
    },
    {
      new: true,
    },
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updatedComment, "comment updated successfully"));
});

export const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user._id;

  if (!isValidObjectId(commentId)) {
    throw new ApiError(400, "invalid commentId");
  }

  const comments = await Comment.findById(commentId);

  if (comments.owner.toString() !== userId?.toString()) {
    throw new ApiError(400, "you are not authorized to delete the comment");
  }

  await Comment.findByIdAndDelete(commentId);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "comment deleted successfully"));
});
