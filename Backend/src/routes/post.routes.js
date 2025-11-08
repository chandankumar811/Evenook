import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    deletePost,
    editPostDetails,
    editPostFile,
    getAllPosts,
    getPostById,
    getPostByUserId,
    publishAPost,
    searchPosts,
    toggleIsPublish,
} from "../controllers/post.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/create-post").post(upload.single("postFile"), publishAPost);
router.route("/p/delete/:postId").delete(deletePost);
router.route("/p/edit-details/:postId").patch(editPostDetails);
router
    .route("/p/edit-file/:postId")
    .patch(upload.single("postFile"), editPostFile);
router.route("/p/toggle-is-published/:postId").patch(toggleIsPublish);
router.route("/all").get(getAllPosts);
router.route("/user-post/:userId").get(getPostByUserId);
router.route("/p/:postId").get(getPostById);
router.route("/search").get(searchPosts);
export default router;
