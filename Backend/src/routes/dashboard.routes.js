import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getUserStats } from "../controllers/dashboard.controller.js";

const router = Router();
router.use(verifyJWT);

router.route("/:userId").get(getUserStats);

export default router;
