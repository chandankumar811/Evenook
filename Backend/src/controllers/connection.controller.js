import db from "../db/index.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { generateUniqueId } from "../utils/generateUniqueId.utils.js";

const followUser = async (req, res) => {
    const { userId } = req.params;

    if (!userId) {
        return res
            .status(400)
            .json(new ApiResponse(400, "Error to get userId"));
    }

    const owner = req.user?.id;
    if (!owner) {
        return res.status(400).json(new ApiResponse(400, "Owner is not found"));
    }

    db.query(
        "SELECT * FROM connection WHERE follower = ? AND following = ?",
        [owner, userId],
        (err, result) => {
            if (err) {
                return res
                    .status(400)
                    .json(new ApiResponse(400, "Error to fetch connection"));
            }

            if (result.length > 0) {
                return res
                    .status(200)
                    .json(new ApiResponse(200, "Already following", null));
            }

            const connectionId = generateUniqueId(6);
            db.query(
                "INSERT INTO connection (id, follower, following) VALUES (?, ?, ?)",
                [connectionId, owner, userId],
                (err) => {
                    if (err) {
                        return res
                            .status(400)
                            .json(
                                new ApiResponse(
                                    400,
                                    err.message,
                                    "Error to follow"
                                )
                            );
                    }

                    return res
                        .status(200)
                        .json(
                            new ApiResponse(
                                200,
                                null,
                                "Followed user successfully"
                            )
                        );
                }
            );
        }
    );
};

const unfollowUser = async (req, res) => {
    const { userId } = req.params;

    if (!userId) {
        return res
            .status(400)
            .json(new ApiResponse(400, "Error to get userId"));
    }

    const owner = req.user?.id;
    if (!owner) {
        return res.status(400).json(new ApiResponse(400, "Owner is not found"));
    }

    db.query(
        "DELETE FROM connection WHERE follower = ? AND following = ?",
        [owner, userId],
        (err) => {
            if (err) {
                return res
                    .status(400)
                    .json(new ApiResponse(400, "Error to unfollow"));
            }

            return res
                .status(200)
                .json(
                    new ApiResponse(200, null, "Unfollowed user successfully")
                );
        }
    );
};

const getFollower = async (req, res) => {
    const { userId } = req.params;

    if (!userId) {
        throw new ApiError(400, "Error to find userId");
    }

    db.query(
        "SELECT users.id, users.username, users.avatar FROM users JOIN connection ON users.id = connection.follower WHERE connection.following = ?",
        [userId],
        (err, result) => {
            if (err) {
                console.log(err);
                return res
                    .status(400)
                    .json(new ApiResponse(400, "Error to fetch result"));
            }
            return res
                .status(200)
                .json(
                    new ApiResponse(
                        200,
                        "Follower fetched successfully",
                        result
                    )
                );
        }
    );
};

const getFollowing = async (req, res) => {
    const { userId } = req.params;

    if (!userId) {
        throw new ApiError(400, "Error to find userId");
    }

    db.query(
        "SELECT users.id, users.username, users.avatar FROM users JOIN connection ON users.id = connection.following WHERE connection.follower = ?",
        [userId],
        (err, result) => {
            if (err) {
                return res
                    .status(400)
                    .json(new ApiResponse(400, "Error to fetch result"));
            }
            return res
                .status(200)
                .json(
                    new ApiResponse(
                        200,
                        "Following fetched successfully",
                        result
                    )
                );
        }
    );
};

const getSuggestions = async (req, res) => {
    const { userId } = req.params;

    if (!userId) {
        return res.status(400).json(new ApiError(400, "User ID is required"));
    }

    db.query(
        `SELECT users.id, users.username, users.avatar, users.instituteName 
         FROM users 
         WHERE users.id NOT IN (
             SELECT following FROM connection WHERE follower = ?
         ) AND users.id != ? 
         LIMIT 6`,
        [userId, userId],
        (err, result) => {
            if (err) {
                return res
                    .status(400)
                    .json(new ApiResponse(400, "Error fetching suggestions"));
            }
            return res
                .status(200)
                .json(
                    new ApiResponse(
                        200,
                        "Suggestions fetched successfully",
                        result
                    )
                );
        }
    );
};

export { followUser, getFollower, getFollowing, getSuggestions, unfollowUser };
