import db from "../db/index.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { generateUniqueId } from "../utils/generateUniqueId.utils.js";

const addComment = async (req, res) => {
    const { content } = req.body;
    const { postId } = req.params;
    const owner = req.user?.id;

    // console.log(req.user);

    if (!content) {
        return res
            .status(401)
            .json(new ApiResponse(401, "Content is required"));
    }

    if (!postId) {
        return res
            .status(401)
            .json(new ApiResponse(401, "Error to get post id"));
    }

    if (!owner) {
        return res.status(401).josn(new ApiResponse(401, "Error to get owner"));
    }

    const commentId = generateUniqueId(6);
    if (!commentId) {
        return res
            .status(401)
            .json(new ApiResponse(401, "Error to generate comment id"));
    }

    db.query(
        "INSERT INTO comment (id, content, post, owner) VALUES (?, ?, ?, ?)",
        [commentId, content, postId, owner],
        (err, result) => {
            if (err) {
                return res
                    .status(401)
                    .json(new ApiResponse(401, "Error to add comment"));
            }

            return res
                .status(200)
                .json(
                    new ApiResponse(200, result, "comment added successfully")
                );
        }
    );
};

const deleteComment = async (req, res) => {
    const { commentId } = req.params;
    if (!commentId) {
        return res
            .status(401)
            .josn(new ApiResponse(401, "Error to get post id"));
    }

    db.query("DELETE FROM comment WHERE id = ?", [commentId], (err) => {
        if (err) {
            return res
                .status(401)
                .josn(new ApiResponse(401, "Error to delete comment"));
        }

        return res
            .status(200)
            .josn(new ApiResponse(200, "comment deleted successfully"));
    });
};

const editComment = async (req, res) => {
    const { content } = req.body;
    if (!content) {
        return res
            .status(401)
            .josn(new ApiResponse(401, "Content is required"));
    }

    const { commentId } = req.params;
    if (!commentId) {
        return res
            .status(401)
            .josn(new ApiResponse(401, "Error to get post id"));
    }

    db.query(
        "UPDATE comment SET content = ? WHERE id = ?",
        [content, commentId],
        (err, result) => {
            if (err) {
                return res
                    .status(401)
                    .josn(new ApiResponse(401, "Error to update comment"));
            }

            if (result.affectedRows === 0) {
                return res
                    .status(401)
                    .josn(new ApiResponse(401, "Comment is not updated"));
            }

            db.query(
                "SELECT * FROM comment WHERE id = ?",
                [commentId],
                (err, result) => {
                    if (err) {
                        return res
                            .status(401)
                            .josn(
                                new ApiResponse(401, "Error to ftech comment")
                            );
                    }

                    return res
                        .status(200)
                        .josn(
                            new ApiResponse(
                                200,
                                result,
                                "Comment updated successfully"
                            )
                        );
                }
            );
        }
    );
};

const getAllComment = async (req, res) => {
    const { postId } = req.params;
    if (!postId) {
        return res
            .status(401)
            .josn(new ApiResponse(401, "Error to get post id"));
    }
    // console.log(postId);
    db.query(
        `SELECT comment.*, users.username AS username,
        users.avatar AS avatar,
        users.id AS userId
        FROM comment
        JOIN users ON comment.owner = users.id
        WHERE post = ?`,
        [postId],
        (err, result) => {
            if (err) {
                console.log(err);
                return res
                    .status(401)
                    .json(new ApiResponse(401, "Error to fetch comment"));
            }

            // if (result.length == 0) {
            //     return res
            //         .status(404)
            //         .json(new ApiResponse(404, "Error to found comment"));
            // }

            // console.log(result);

            return res
                .status(200)
                .json(
                    new ApiResponse(
                        200,
                        "Comments fetched successfully",
                        result
                    )
                );
        }
    );
};

const getCommentById = async (req, res) => {
    const { commentId } = req.params;
    if (!commentId) {
        return res
            .status(401)
            .josn(new ApiResponse(401, "Error to get comment id"));
    }

    db.query(
        "SELECT * FROM comment WHERE id = ?",
        [commentId],
        (err, result) => {
            if (err) {
                return res
                    .status(401)
                    .josn(new ApiResponse(401, "Error to ftech comment"));
            }

            return res
                .status(200)
                .josn(
                    new ApiResponse(
                        200,
                        result,
                        "Comment fetched successfully successfully"
                    )
                );
        }
    );
};

export {
    addComment,
    deleteComment,
    editComment,
    getAllComment,
    getCommentById,
};
