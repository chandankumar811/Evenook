import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    addComment,
    deleteComment,
    editComment,
    getAllComment,
    getCommentById,
} from "../controllers/comment.controller.js";

const router = Router();
router.use(verifyJWT);

router.route("/c/:postId").post(addComment).get(getAllComment);
router
    .route("/c/:commentId")
    .get(getCommentById)
    .patch(editComment)
    .delete(deleteComment);


    export default router