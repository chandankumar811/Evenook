import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    followUser,
    getFollower,
    getFollowing,
    getSuggestions,
    unfollowUser,
} from "../controllers/connection.controller.js";

const router = Router();
router.use(verifyJWT);

router.route("/follow/:userId").post(followUser);
router.route("/unfollow/:userId").post(unfollowUser);
router.route("/get-follower/:userId").get(getFollower);
router.route("/get-suggest/:userId").get(getSuggestions);
router.route("/get-following/:userId").get(getFollowing);

export default router;
