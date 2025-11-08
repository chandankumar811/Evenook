import db from "../db/index.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const getUserStats = async (req, res) => {
    try {
        const { userId } = req.params;
        console.log("Fetching stats for user ID:", userId);

        if (!userId) {
            return res
                .status(400)
                .json(new ApiResponse(400, null, "User ID is required"));
        }

        // Step 1: Get user details
        db.query("SELECT * FROM users WHERE id = ?", [userId], (err, userResult) => {
            if (err) {
                console.error("Error fetching user:", err);
                return res
                    .status(500)
                    .json(new ApiResponse(500, null, "Database query error"));
            }

            if (userResult.length === 0) {
                return res
                    .status(404)
                    .json(new ApiResponse(404, null, "User not found"));
            }

            // Remove sensitive fields
            const { password, refreshToken, ...userData } = userResult[0];

            // Step 2: Get total followers
            db.query(
                "SELECT COUNT(*) AS totalFollowers FROM connection WHERE following = ?",
                [userId],
                (err, followersResult) => {
                    if (err) {
                        console.error("Error fetching followers:", err);
                        return res
                            .status(500)
                            .json(new ApiResponse(500, null, "Error fetching followers"));
                    }

                    // Step 3: Get total following
                    db.query(
                        "SELECT COUNT(*) AS totalFollowing FROM connection WHERE follower = ?",
                        [userId],
                        (err, followingResult) => {
                            if (err) {
                                console.error("Error fetching following:", err);
                                return res
                                    .status(500)
                                    .json(new ApiResponse(500, null, "Error fetching following"));
                            }

                            // Step 4: Get total posts
                            db.query(
                                "SELECT COUNT(*) AS totalPosts FROM post WHERE owner = ?",
                                [userId],
                                (err, postsResult) => {
                                    if (err) {
                                        console.error("Error fetching posts:", err);
                                        return res
                                            .status(500)
                                            .json(new ApiResponse(500, null, "Error fetching posts"));
                                    }

                                    // ✅ Combine all results safely
                                    const totalFollowers = followersResult?.[0]?.totalFollowers || 0;
                                    const totalFollowing = followingResult?.[0]?.totalFollowing || 0;
                                    const totalPosts = postsResult?.[0]?.totalPosts || 0;

                                    return res.status(200).json(
                                        new ApiResponse(
                                            200,
                                            "User details and stats fetched successfully",
                                            {
                                                userData,
                                                totalFollowers,
                                                totalFollowing,
                                                totalPosts,
                                            },
                                        )
                                    );
                                }
                            );
                        }
                    );
                }
            );
        });
    } catch (error) {
        console.error("Server error:", error);
        return res.status(500).json(new ApiResponse(500, null, "Server error"));
    }
};

export { getUserStats };
