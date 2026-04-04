import mongoose, { isValidObjectId } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  const userId = req.user?._id;

  if (!isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid channelId");
  }

  const isExist = await Subscription.findOne({
    subscriber: userId,
    channel: channelId,
  });
  let subscription = null;

  if (isExist) {
    await Subscription.findByIdAndDelete(isExist._id);
    return res
      .status(200)
      .json(new ApiResponse(200, null, "channel Unsubscribed"));
  } else {
    subscription = await Subscription.create({
      subscriber: userId,
      channel: channelId,
    });
    return res
      .status(200)
      .json(new ApiResponse(200, subscription, "Channel Subscribed"));
  }
});

export const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  // const channelId = req.user?._id

  if (!isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid channelId");
  }

  const subscribers = await Subscription.aggregate([
    {
      $match: {
        channel: new mongoose.Types.ObjectId(channelId),
      },
    },
    {
      $count: "subscribers_count",
    },
  ]);  // check this controller is used or not.

  const count = subscribers.length > 0 ? subscribers[0].subscribers_count : 0;
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { subscribers_count: count },
        "UserChannelSubscribers fetched successfully",
      ),
    );
});

export const getSubscribedChannels = asyncHandler(async (req, res) => {
  const subscriberId  = req.user?._id
  

  if (!isValidObjectId(subscriberId)) {
    throw new ApiError(400, "Invalid subscriberId");
  }

  const subscribedChannels = await Subscription.aggregate([
    {
      $match: {
        subscriber: new mongoose.Types.ObjectId(subscriberId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "channel",
        foreignField: "_id",
        as: "channel",
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
        channel: {
          $first: "$channel",
        },
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        Array.isArray(subscribedChannels) ? subscribedChannels : [],
        "subscribedChannels fetched successfully",
      ),
    );
});
