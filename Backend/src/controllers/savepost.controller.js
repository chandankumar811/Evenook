import db from "../db/index.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { generateUniqueId } from "../utils/generateUniqueId.utils.js";

const savePost = async (req, res) => {
    const { postId } = req.params;
    if (!postId) {
        throw new ApiError(401, "Error to get post id");
    }
    const userId = req.user?.id;
    if (!userId) {
        throw new ApiError(401, "Error to get user id");
    }

    // console.log(postId, userId)

    const saveId = generateUniqueId(6);
    if (!saveId) {
        return res
            .status(500)
            .json(new ApiResponse(500, "Save id is not found"));
    }

    db.query(
        "INSERT INTO savepost (id, postId, owner) VALUES (?, ?, ?)",
        [saveId, postId, userId],
        (err) => {
            if (err) {
                if (err) {
                    throw new ApiError(400, "Error to create post");
                }
            }
            return res
                .status(200)
                .json(new ApiResponse(200, "Post saved Successfull"));
        }
    );
};

const removeSavedPost = async (req, res) => {
    const { postId } = req.params;
    if (!postId) {
        return res
            .status(500)
            .json(new ApiResponse(500, "Post id is not found"));
    }
    const userId = req.user?.id;

    // console.log(postId);

    db.query(
        "DELETE FROM savepost WHERE postId = ? AND owner = ?",
        [postId, userId],
        (err) => {
            if (err) {
                return res
                    .status(401)
                    .json(
                        new ApiResponse(401, "Error to removed saved post", err)
                    );
            }
            return res
                .status(200)
                .json(new ApiResponse(200, "Post removed successfull"));
        }
    );
};

const getSavedPost = async (req, res) => {
    const userId = req.user?.id;
    if (!userId) {
        throw new ApiError(401, "Error to get user id");
    }

    db.query(
        `SELECT 
    sp.id AS savePostId, 
    p.id AS postId, 
    p.postFile, 
    p.title, 
    p.description, 
    p.isPublished, 
    u.id AS ownerId, 
    u.username, 
    u.fullName, 
    u.avatar, 
    u.email,
    (SELECT COUNT(*) FROM savepost WHERE postID = p.id) AS totalSaves,
    (SELECT COUNT(*) FROM likes WHERE post = p.id) AS totalLikes,
    (SELECT COUNT(*) FROM comment WHERE post = p.id) AS totalComments
FROM savepost sp
JOIN post p ON sp.postID = p.id
JOIN users u ON sp.owner = u.id
WHERE sp.owner = ?`,
        [userId],
        (err, result) => {
            if (err) {
                throw new ApiError(400, "Error to create post");
            }

            return res
                .status(200)
                .json(
                    new ApiResponse(200, "Error to fetch saved post", result)
                );
        }
    );
};

const getSavedByCurrentUser = async (req, res) => {
    const { postId } = req.params;
    const likeBy = req.user?.id;

    // console.log( postId);

    if (!postId)
        return res.status(400).json(new ApiError(400, "Post ID is required"));

    if (!likeBy)
        return res.status(400).json(new ApiError(400, "User ID is required"));
    db.query(
        "SELECT * FROM savepost WHERE owner = ? AND postId = ?",
        [likeBy, postId],
        (err, result) => {
            if (err) {
                return res
                    .status(500)
                    .json(
                        new ApiError(
                            500,
                            err.message,
                            "Error to get saved post by current user"
                        )
                    );
            }
            return res
                .status(200)
                .json(
                    new ApiResponse(
                        200,
                        "Get saved post successfully by current user",
                        result
                    )
                );
        }
    );
};

export { savePost, removeSavedPost, getSavedPost, getSavedByCurrentUser };
