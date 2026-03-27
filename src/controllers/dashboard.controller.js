import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Subscription } from "../models/subscription.model.js";

export const getChannelStats = asyncHandler(async (req, res) => {
  const channelId = req.user._id;

  const [totalStats, totalSubscribers] = await Promise.all([
    Video.aggregate([
      {
        $match: {
          owner: new mongoose.Types.ObjectId(channelId),
        },
      },
      {
        $facet: {
          videoStats: [
            {
              $group: {
                _id: null,
                totalViews: { $sum: "$views" },
                totalVideos: { $sum: 1 },
              },
            },
          ],
          totalLike: [
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
                likesCount: {
                  $size: "$likes",
                },
              },
            },
            {
              $group: {
                _id: null,
                totalLikes: { $sum: "$likesCount" },
              },
            },
          ],
        },
      },
    ]),

    Subscription.countDocuments({ channel: channelId }),
  ]);

  const stats = {
    totalVideos: totalStats[0]?.allVideos || [],
    totalVideoViews: totalStats[0]?.videoStats[0]?.totalViews || 0,
    totalVideoCount: totalStats[0]?.videoStats[0]?.totalVideos || 0,
    totalLike: totalStats[0]?.totalLike[0]?.totalLikes || 0,
    totalSubscribersCount: totalSubscribers || 0,
  };

  return res
    .status(200)
    .json(new ApiResponse(200, stats, "fetched channel stats"));
});

export const getChannelVideos = asyncHandler(async (req, res) => {
  const channelId = req.user._id;

  const userVideos = await Video.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(channelId),
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
      $addFields: {
        owner: {
          $first: "$owner",
        },
      },
    },

    
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, userVideos, "user videos fetched"));
});
