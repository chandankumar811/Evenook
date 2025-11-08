import { Router } from "express";
import {
    createUserInfo,
    createUserSession,
    getCurrentUser,
    getUserById,
    loginUser,
    logoutUser,
    registerUser,
    searchUsers,
    updateAvatar,
    updateCoverImage,
    updateCurrentPassword,
    verifyOTP,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { console } from "inspector";

const router = Router();

router.route("/u/create-user-info/:userId").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1,
        },
        {
            name: "coverImage",
            maxCount: 1,
        },
    ]),
    createUserInfo
);

router.get("/get-user", verifyJWT, (req, res) => {
    console.log("get user");
    const { password, refreshToken, ...user } = req.user;
    res.status(200).json({
        user,
    });
});

router.route("/session").post(createUserSession);
router.route("/verify-otp").post(verifyOTP);
router.route("/user").post(registerUser);
router.route("/login").post(loginUser);

router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/user/:id").get(verifyJWT, getUserById);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/change-password").patch(verifyJWT, updateCurrentPassword);
router.route("/avatar").patch(verifyJWT, upload.single("avatar"), updateAvatar);
router
    .route("/cover-image")
    .patch(verifyJWT, upload.single("coverImage"), updateCoverImage);

router.route("/search").get(searchUsers);
export default router;
