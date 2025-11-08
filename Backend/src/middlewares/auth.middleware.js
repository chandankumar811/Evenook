import db from "../db/index.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

export const verifyJWT = asyncHandler(async (req, _, next) => {
    try {
        // console.log("middleware")
        const token =
            (await req.cookies?.accessToken) ||
            req.header("Authorization")?.replace("Bearer ", "");
        // console.log(token)
        if (!token) {
            throw new ApiError(401, "Unauthorized request");
        }

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        // console.log(decoded);
        db.query(
            "SELECT * FROM users WHERE id = ?",
            [decoded.id],
            (error, results) => {
                if (error) {
                    throw new ApiError(
                        401,
                        error?.message || "Invalid access Token"
                    );
                }
                if (results.length === 0) {
                    throw new ApiError(401, "user not found");
                    next();
                }
                req.user = results[0];
                next();
                // console.log("move to next");
            }
        );
    } catch (error) {
        console.log("error"
        );
        throw new ApiError(401, error?.message || "Unauthorized request");
    }
});
