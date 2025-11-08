import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    deleteLike,
    getLikeByCurrentUser,
    likePost,
} from "../controllers/like.controller.js";

const router = Router();

router.use(verifyJWT);

// router.route("/:postId").post(togglePostLike)
router.route("/:postId").post(likePost).delete(deleteLike);
router.route("/get-like-by-current-user/:postId").get(getLikeByCurrentUser);

export default router;
