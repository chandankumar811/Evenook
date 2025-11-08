import db from "../db/index.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { generateUniqueId } from "../utils/generateUniqueId.utils.js";

const likePost = async (req, res) => {
    const { postId } = req.params;
    const likeBy = req.user?.id;
    console.log(postId);
    if (!postId)
        return res.status(400).json(new ApiError(400, "Post ID is required"));
    if (!likeBy)
        return res.status(400).json(new ApiError(400, "User ID is required"));

    const likeId = generateUniqueId(6);
    if (!likeId)
        return res
            .status(500)
            .json(new ApiError(500, "Failed to generate unique ID"));

    // console.log(likeId);

    db.query(
        "INSERT INTO likes (id, post, likeBy) VALUES (?, ?, ?)",
        [likeId, postId, likeBy],
        (err) => {
            if (err) {
                return res
                    .status(500)
                    .json(new ApiError(500, err.message, "Error liking post"));
            }
            db.query(
                "SELECT * FROM likes WHERE likeBy = ?",
                [likeBy],
                (err, result) => {
                    if (err) {
                        return res
                            .status(500)
                            .json(
                                new ApiError(
                                    500,
                                    err.message,
                                    "error to fetch like"
                                )
                            );
                    }
                    return res
                        .status(200)
                        .json(
                            new ApiResponse(
                                200,
                                "Post liked successfully",
                                result
                            )
                        );
                }
            );
        }
    );
};

const deleteLike = async (req, res) => {
    const { postId } = req.params;
    const likeBy = req.user?.id;

    // console.log(postId, likeBy);

    if (!postId)
        return res.status(400).json(new ApiError(400, "Post ID is required"));
    if (!likeBy)
        return res.status(400).json(new ApiError(400, "User ID is required"));

    db.query(
        "DELETE FROM likes WHERE likeBy = ? AND post = ?",
        [likeBy, postId],
        (err) => {
            if (err) {
                return res
                    .status(500)
                    .json(
                        new ApiError(500, err.message, "Error unliking post")
                    );
            }

            return res
                .status(200)
                .json(new ApiResponse(200, null, "Post unliked successfully"));
        }
    );
};

const getLikeByCurrentUser = async (req, res) => {
    const { postId } = req.params;
    const likeBy = req.user?.id;

    // console.log( likeBy);

    if (!postId)
        return res.status(400).json(new ApiError(400, "Post ID is required"));

    if (!likeBy)
        return res.status(400).json(new ApiError(400, "User ID is required"));
    db.query(
        "SELECT * FROM likes WHERE likeBy = ? AND post = ?",
        [likeBy, postId],
        (err, result) => {
            if (err) {
                return res
                    .status(500)
                    .json(
                        new ApiError(
                            500,
                            err.message,
                            "Error to get liked post by current user"
                        )
                    );
            }
            return res
                .status(200)
                .json(
                    new ApiResponse(
                        200,
                        "Get liked post successfully by current user",
                        result
                    )
                );
        }
    );
};

const toggleCommentLike = async (req, res) => {
    const { commentId } = req.params;
    const likeBy = req.user?.id;

    if (!commentId)
        return res
            .status(400)
            .json(new ApiError(400, "comment ID is required"));
    if (!likeBy)
        return res.status(400).json(new ApiError(400, "User ID is required"));

    const likeId = generateUniqueId(6);
    if (!likeId)
        return res
            .status(500)
            .json(new ApiError(500, "Failed to generate unique ID"));

    // console.log(likeId);

    db.query(
        "SELECT id FROM post WHERE id = ?",
        [commentId],
        (err, postResult) => {
            if (err)
                return res
                    .status(500)
                    .json(
                        new ApiError(
                            500,
                            err.message,
                            "Error checking comment existence"
                        )
                    );

            if (postResult.length === 0) {
                return res
                    .status(404)
                    .json(new ApiError(404, "comment not found"));
            }

            db.query(
                "SELECT * FROM likes WHERE likeBy = ? AND post = ?",
                [likeBy, commentId],
                (err, likeResult) => {
                    if (err) {
                        return res
                            .status(500)
                            .json(
                                new ApiError(
                                    500,
                                    err.message,
                                    "Error fetching like status"
                                )
                            );
                    }

                    if (likeResult.length > 0) {
                        db.query(
                            "DELETE FROM likes WHERE likeBy = ? AND post = ?",
                            [likeBy, commentId],
                            (err) => {
                                if (err) {
                                    return res
                                        .status(500)
                                        .json(
                                            new ApiError(
                                                500,
                                                err.message,
                                                "Error unliking comment"
                                            )
                                        );
                                }

                                return res
                                    .status(200)
                                    .json(
                                        new ApiResponse(
                                            200,
                                            null,
                                            "comment unliked successfully"
                                        )
                                    );
                            }
                        );
                    } else {
                        db.query(
                            "INSERT INTO likes (id, post, likeBy) VALUES (?, ?, ?)",
                            [likeId, commentId, likeBy],
                            (err, result) => {
                                if (err) {
                                    return res
                                        .status(500)
                                        .json(
                                            new ApiError(
                                                500,
                                                err.message,
                                                "Error liking comment"
                                            )
                                        );
                                }

                                return res
                                    .status(200)
                                    .json(
                                        new ApiResponse(
                                            200,
                                            result,
                                            "comment liked successfully"
                                        )
                                    );
                            }
                        );
                    }
                }
            );
        }
    );
};

export { toggleCommentLike, likePost, deleteLike, getLikeByCurrentUser };
