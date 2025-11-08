import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    getSavedByCurrentUser,
    getSavedPost,
    removeSavedPost,
    savePost,
} from "../controllers/savepost.controller.js";

const router = Router();
router.use(verifyJWT);

router.route("/save-post/:postId").post(savePost);
router.route("/remove-post/:postId").delete(removeSavedPost);
router.route("/get-saved-post").get(getSavedPost);
router
    .route("/get-save-post-by-current-user/:postId")
    .get(getSavedByCurrentUser);

export default router;
