import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.utils.js";
import db from "../db/index.js";
import { generateUniqueId } from "../utils/generateUniqueId.utils.js";
// import { json } from "body-parser";

const publishAPost = async (req, res) => {
    const { title, description } = req.body;

    if (!title || !description) {
        throw new ApiError(400, "Required all field");
    }

    console.log(title, description);

    const postFileLocalPath = req.file?.path;

    const postFile = await uploadOnCloudinary(postFileLocalPath);

    if (!postFile.url) {
        throw new ApiError(401, "Error to upload post file");
    }

    console.log(postFile.url);

    const owner = req.user?.id;

    const postId = generateUniqueId(6);
    if (!postId) {
        return res
            .status(500)
            .json(new ApiResponse(500, "Post id is not found"));
    }

    db.query(
        "INSERT INTO post (id, title, description, postFile, owner) VALUES (?, ?, ?, ?, ?)",
        [postId, title, description, postFile.url, owner],
        (err, result) => {
            if (err) {
                throw new ApiError(400, "Error to create post");
            }

            // console.log(result.insertId);

            db.query(
                "SELECT * FROM post WHERE id = ?",
                [result.insertId],
                (err, result) => {
                    if (err) {
                        throw new ApiError(401, "Error to find post");
                    }
                    return res
                        .status(200)
                        .json(
                            new ApiResponse(
                                200,
                                result,
                                "Post created successfully"
                            )
                        );
                }
            );
        }
    );
};

const deletePost = async (req, res) => {
    const { postId } = req.params;

    if (!postId) {
        throw new ApiError(401, "Error to get post id");
    }

    db.query("DELETE FROM post WHERE id = ?", [postId], (err) => {
        if (err) {
            throw new ApiError(401, "Error to delete the post");
        }

        return res
            .status(200)
            .json(new ApiResponse(200, "Post deleted successfull"));
    });
};

const editPostDetails = async (req, res) => {
    const { title, description } = req.body;
    const { postId } = req.params;

    if (!title || !description) {
        throw new ApiError(400, "All field are required");
    }

    if (!postId) {
        throw new ApiError(400, "Error to get post id");
    }

    db.query(
        "UPDATE post SET title = ?, description = ? WHERE id = ?",
        [title, description, postId],
        (err, result) => {
            if (err) {
                throw new ApiError(400, "Error to update post details");
            }

            if (result.affectedRows === 0) {
                throw new ApiError(402, "Post not found");
            }

            db.query(
                "SELECT * FROM post WHERE id = ?",
                [postId],
                (err, result) => {
                    if (err) {
                        throw new ApiError(401, "Error to fetch post");
                    }

                    return res
                        .status(200)
                        .json(
                            new ApiResponse(
                                200,
                                result[0],
                                "Post details updated successfully"
                            )
                        );
                }
            );
        }
    );
};

const editPostFile = async (req, res) => {
    const { postId } = req.params;

    if (!postId) {
        throw new ApiError(401, "Error to get post id");
    }

    const postFileLocalPath = req.file?.path;
    if (!postFileLocalPath) {
        throw new ApiError(400, "Post file is required");
    }

    const postFile = await uploadOnCloudinary(postFileLocalPath);
    if (!postFile.url) {
        throw new ApiError(401, "Error to upload Post file");
    }

    db.query(
        "UPDATE post SET postFile = ? WHERE id = ?",
        [postFile.url, postId],
        (err, result) => {
            if (err) {
                throw new ApiError(401, "Error to update post file");
            }

            if (result.affectedRows === 0) {
                throw new (401, "Error to update post file")();
            }

            db.query(
                "SELECT * FROM post WHERE id = ? ",
                [postId],
                (err, result) => {
                    if (err) {
                        throw new ApiError(401, "Error to fetch post");
                    }

                    return res
                        .status(200)
                        .json(
                            new ApiResponse(
                                200,
                                result[0],
                                "Post file updated successfully"
                            )
                        );
                }
            );
        }
    );
};

const toggleIsPublish = async (req, res) => {
    const { postId } = req.params;
    if (!postId) {
        throw new ApiError(401, "Error to get post id");
    }

    db.query(
        "SELECT isPublished FROM post WHERE id = ?",
        [postId],
        (err, result) => {
            if (err) {
                throw new ApiError(401, "Error to select isPublished");
            }

            let isPublished = result[0].isPublished;
            isPublished = !isPublished;

            // console.log(isPublished);

            db.query(
                "UPDATE post SET isPublished = ? WHERE id = ?",
                [isPublished, postId],
                (err, result) => {
                    if (err) {
                        throw new ApiError(401, "Error to update isPublished");
                    }

                    if (result.affectedRows === 0) {
                        throw new ApiError(401, "");
                    }

                    db.query(
                        "SELECT * FROM post WHERE id = ?",
                        [postId],
                        (err, result) => {
                            if (err) {
                                throw new ApiError(401, "Error to fetch post");
                            }

                            return res
                                .status(200)
                                .json(
                                    new ApiResponse(
                                        200,
                                        result[0],
                                        "isPublished toggled successfully"
                                    )
                                );
                        }
                    );
                }
            );
        }
    );
};

const getAllPosts = async (req, res) => {
    db.query(
        `SELECT 
            post.*, 
            users.username AS username, 
            users.avatar AS avatar, 
            users.program AS program, 
            users.instituteName AS instituteName, 
            (SELECT COUNT(*) FROM likes WHERE likes.post = post.id) AS totalLikes, 
            (SELECT COUNT(*) FROM comment WHERE comment.post = post.id) AS totalComments ,
            (SELECT COUNT(*) FROM savepost WHERE savepost.postId = post.id) AS totalSaves
        FROM post 
        JOIN users ON post.owner = users.id 
        LEFT JOIN likes ON post.id = likes.post 
        LEFT JOIN comment ON post.id = comment.post 
        GROUP BY post.id, users.username, users.avatar, users.program, users.instituteName`,
        [true],
        (err, result) => {
            if (err) {
                console.error("Error fetching posts:", err);
                return res
                    .status(500)
                    .json(new ApiError(500, "Error fetching posts"));
            }

            if (!result.length) {
                return res
                    .status(404)
                    .json(new ApiError(404, "No posts found"));
            }

            return res
                .status(200)
                .json(
                    new ApiResponse(200, "Posts fetched successfully", result)
                );
        }
    );
};

const getPostByUserId = async (req, res) => {
    const { userId } = req.params;

    if (!userId) {
        return res.status(400).json(new ApiError(400, "User ID is required"));
    }

    const query = `
        SELECT post.*, 
               users.username AS username, 
               users.avatar AS avatar, 
               users.program AS program, 
               users.instituteName AS instituteName,
               (SELECT COUNT(*) FROM likes WHERE likes.post = post.id) AS totalLikes,
               (SELECT COUNT(*) FROM comment WHERE comment.post = post.id) AS totalComments,
                (SELECT COUNT(*) FROM savepost WHERE savepost.postId = post.id) AS totalSaves
        FROM post 
        JOIN users ON post.owner = users.id
        WHERE owner = ? `;

    db.query(query, [userId], (err, result) => {
        if (err) {
            console.error("SQL Error:", err);
            return res
                .status(500)

                .json(
                    new ApiResponse(500, "Error fetching posts", err.message)
                );
        }

        return res
            .status(200)
            .json(new ApiResponse(200, "Posts fetched successfully", result));
    });
};

const getPostById = async (req, res) => {
    const { PostId } = req.params;

    if (!PostId) {
        return res.status(400).json(new ApiError(400, "User ID is required"));
    }

    const query = `
        SELECT post.*, 
               users.username AS username, 
               users.avatar AS avatar, 
               users.program AS program, 
               users.instituteName AS instituteName,
               (SELECT COUNT(*) FROM likes WHERE likes.post = post.id) AS totalLikes,
               (SELECT COUNT(*) FROM comment WHERE comment.post = post.id) AS totalComments,
               IFNULL(JSON_LENGTH(users.savePost), 0) AS totalSaved
        FROM post 
        JOIN users ON post.owner = users.id
        WHERE id = ? `;

    db.query(query, [userId], (err, result) => {
        if (err) {
            // console.error("SQL Error:", err);
            return res
                .status(500)

                .json(
                    new ApiResponse(500, "Error fetching posts", err.message)
                );
        }

        return res
            .status(200)
            .json(new ApiResponse(200, "Posts fetched successfully", result));
    });
};

const searchPosts = async (req, res) => {
    const { query } = req.query;
    // console.log(query)

    if(!query) {
        return res.status(400).json(new ApiError(400, "query is required"));
    }

    const sql = `SELECT * FROM post WHERE title LIKE ? OR description LIKE ? OR owner LIKE ?`;
    const searchTerm = `%${query}%`;

    db.query(sql, [searchTerm, searchTerm, searchTerm], (err, result) => {
        if (err) {
            console.error("SQL Error:", err);
            return res
                .status(500)
                .json(new ApiResponse(500, "Error fetching posts", err.message));
        }

        if (!result.length) {
            return res.status(404).json(new ApiError(404, "No posts found"));
        }

        return res
            .status(200)
            .json(new ApiResponse(200, "Posts fetched successfully", result));
    });

}

export {
    publishAPost,
    deletePost,
    editPostDetails,
    editPostFile,
    toggleIsPublish,
    getAllPosts,
    getPostByUserId,
    getPostById,
    searchPosts,
};
