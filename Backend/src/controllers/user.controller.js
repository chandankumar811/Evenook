import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { hashPassword } from "../utils/bcrypt.utils.js";
import { generateUniqueId } from "../utils/generateUniqueId.utils.js";
import { comparePassword } from "../utils/bcrypt.utils.js";
import {
    generateAccessToken,
    generateRefreshToken,
} from "../utils/token.utils.js";
import { ApiError } from "../utils/ApiError.js";
import db from "../db/index.js";
import { sendMail } from "../utils/mailer.utils.js";
import { generateOTP } from "../utils/otp.utils.js";
import { uploadOnCloudinary } from "../utils/cloudinary.utils.js";

const generateAccessAndRefreshToken = (userId, callback) => {
    db.query("SELECT * FROM users WHERE id = ?", [userId], (err, results) => {
        if (err) {
            return callback(new ApiError(500, "Failed to get user"), null);
        }
        if (!results.length) {
            return callback(new ApiError(404, "User not found"), null);
        }

        const user = results[0];

        // Generate tokens
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        // Update refreshToken in DB
        db.query(
            "UPDATE users SET refreshToken = ? WHERE id = ?",
            [refreshToken, userId],
            (err) => {
                if (err) {
                    return callback(
                        new ApiError(500, "Failed to update refresh token"),
                        null
                    );
                }

                // Pass tokens via callback
                return callback(null, { accessToken, refreshToken });
            }
        );
    });
};

const otpStore = new Map();

const createUserSession = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: "Please provide all fields" });
    }

    db.query(
        "SELECT * FROM users WHERE email = ?",
        [email],
        async (err, result) => {
            if (err) {
                return res
                    .status(400)
                    .json({ message: "Error to fetch users" });
            }

            if (result.length > 0) {
                return res
                    .status(400)
                    .json(
                        new ApiResponse(
                            400,
                            "Email already exist || Sign in to account"
                        )
                    );
            } else {
                const hashedPassword = await hashPassword(password);
                if (!hashedPassword) {
                    return res
                        .status(500)
                        .json({ message: "Failed to hash password" });
                }

                const otp = generateOTP();
                if (!otp) {
                    return res
                        .status(500)
                        .json({ message: "Failed to generate OTP" });
                }

                otpStore.set(email, {
                    otp,
                    username,
                    hashedPassword,
                });

                const sendOtp = await sendMail(
                    email,
                    "OTP for email verification",
                    `Your OTP is ${otp}`,
                    `<p>Your OTP is <strong>${otp}</strong></p>`
                );

                if (!sendOtp) {
                    return res
                        .status(500)
                        .json({ message: "Failed to send OTP" });
                }

                return res
                    .status(200)
                    .json({ sendOtp, message: "OTP sent to email" });
            }
        }
    );
};

const verifyOTP = async (req, res) => {
    const { email, otp } = req.body;

    if (!otp || !email) {
        throw new ApiError(400, "Please provide OTP and email");
    }

    const user = otpStore.get(email);
    // console.log(otpStore);
    // console.log(user);

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    if (user.otp !== otp) {
        throw new ApiError(400, "Invalid OTP");
    }

    return res.status(200).json(new ApiResponse(200, "OTP verified"));
};

const registerUser = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        throw new ApiError(400, "Please provide email");
    }
    const user = otpStore.get(email);
    console.log(otpStore);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const id = generateUniqueId(8);
    if (!id) {
        throw new ApiError(500, "Failed to generate unique ID");
    }

    db.query(
        "INSERT INTO users (id, username, email, password) VALUES (?, ?, ?, ?)",
        [id, user.username, email, user.hashedPassword],
        (err) => {
            if (err) {
                return res
                    .status(500)
                    .json({ message: "Failed to create user" });
            }

            db.query(
                "SELECT * FROM users WHERE id = ?",
                [id],
                (err, result) => {
                    if (err) {
                        return res
                            .status(500)
                            .json({ message: "Failed to fetch user" });
                    }
                    const user = result[0];
                    delete otpStore[email];
                    return res
                        .status(200)
                        .json({ user, message: "User created successfully" });
                }
            );
        }
    );
};

const createUserInfo = async (req, res) => {
    const {
        fullName,
        accountType,
        gender,
        institutionLevel,
        program,
        department,
        clubType,
        instituteName,
        bio,
    } = req.body;

    const { userId } = req.params;

    if (
        [
            fullName,
            accountType,
            gender,
            institutionLevel,
            program,
            department,
            clubType,
            instituteName,
            bio,
        ].some((field) => !field || field.trim() === "")
    ) {
        throw new ApiError(400, "Please provide all fields");
    }

    const avatarLocalPath = req.files.avatar[0].path;
    console.log(avatarLocalPath);

    if (!avatarLocalPath) {
        throw new ApiError(400, "Please provide avatar");
    }

    let coverImageLocalPath = null;
    if (
        req.files &&
        Array.isArray(req.files.coverImage) &&
        req.files.coverImage.length > 0
    ) {
        coverImageLocalPath = req.files.coverImage[0].path;
    }

    console.log(coverImageLocalPath);

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    console.log(avatar);
    console.log(coverImage);

    if (!coverImage) {
        throw new ApiError(500, "Failed to upload cover image");
    }

    if (!avatar) {
        throw new ApiError(500, "Failed to upload avatar");
    }

    db.query(
        "UPDATE users SET fullName = ?, avatar = ?, coverImage = ?, accountType = ?, gender = ?, institutionLevel = ?, program = ?, department = ?, clubType = ?, instituteName = ?, bio = ?  WHERE id = ?",
        [
            fullName,
            avatar.url,
            coverImage.url,
            accountType,
            gender,
            institutionLevel,
            program,
            department,
            clubType,
            instituteName,
            bio,
            userId,
        ],
        (err, result) => {
            if (err) {
                throw new ApiError(500, "Failed to update user info");
            }

            return res
                .status(200)
                .json(
                    new ApiResponse(
                        200,
                        result,
                        "User info updated successfully"
                    )
                );
        }
    );
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "Please provide email and password");
    }

    db.query(
        "SELECT * FROM users WHERE email = ?",
        [email],
        async (err, result) => {
            if (err) {
                throw new ApiError(500, "Failed to login user");
            }

            if (!result.length) {
                throw new ApiError(404, "User not found");
            }

            const user = result[0];
            const isPasswordMatch = await comparePassword(
                password,
                user.password
            );

            if (!isPasswordMatch) {
                throw new ApiError(401, "Invalid credentials");
            }

            generateAccessAndRefreshToken(user.id, (err, tokens) => {
                if (err) {
                    throw err;
                }

                const { accessToken, refreshToken } = tokens;

                db.query(
                    "SELECT * FROM users WHERE id = ?",
                    [user.id],
                    (err, loggedInUser) => {
                        if (err) {
                            throw new ApiError(
                                500,
                                err.message,
                                "Failed to get user"
                            );
                        }

                        const options = {
                            httpOnly: true,
                            secure: false,
                            sameSite: "lax",
                        };

                        const { password, refreshToken, ...user } =
                            loggedInUser[0];

                        // console.log(user);

                        return res
                            .status(200)
                            .cookie("accessToken", accessToken, options)
                            .json(
                                new ApiResponse(
                                    200,
                                    {
                                        user: user,
                                        accessToken,
                                    },
                                    "User logged in successfully"
                                )
                            );
                    }
                );
            });
        }
    );
};

const getUserById = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        throw new ApiError(400, "Please provide user ID");
    }

    db.query("SELECT * FROM users WHERE id = ?", [id], (err, result) => {
        if (err) {
            throw new ApiError(500, "Failed to get user");
        }

        if (!result.length) {
            throw new ApiError(404, "User not found");
        }

        const { password, refreshToken, ...user } = result[0];

        return res.status(200).json(new ApiResponse(200, "User found", user));
    });
};

const getCurrentUser = async (req, res) => {
    db.query(
        "SELECT * FROM users WHERE id = ?",
        [req.user.id],
        (err, result) => {
            if (err) {
                return res
                    .status(500)
                    .json(new ApiResponse(500, "Error to fetch user"));
            }

            const { password, refreshToken, ...user } = result[0];
            return res
                .status(200)
                .json(new ApiResponse(200, "User fetch successfully", user));
        }
    );
};

const logoutUser = async (req, res) => {
    const refreshToken = null;
    db.query(
        "UPDATE users SET refreshToken = ? WHERE id = ?",
        [refreshToken, req.user.id],
        (err) => {
            if (err) {
                return callback(new ApiError(500, "Error to logout user"));
            }

            const options = {
                httpOnly: true,
                secure: true,
                sameSite: "None", // if originally used
                path: "/",
            };

            return res
                .status(200)
                .clearCookie("accessToken", options)
                .clearCookie("refreshToken", options)
                .json(new ApiResponse(200, "User logout successfully", {}));
        }
    );
};

const updateAvatar = async (req, res) => {
    const avatarLocalPath = req.file?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is missing");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);

    if (!avatar.url) {
        throw new ApiError(400, "Error while uploading on avatar");
    }

    db.query(
        "UPDATE users SET avatar = ? WHERE id = ?",
        [avatar.url, req.user.id],
        (err, result) => {
            if (err) {
                return callback(new ApiError(500, "Error to update avatar"));
            }

            if (result.affectedRows === 0) {
                return callback(new ApiError(404, "User not found"));
            }

            db.query(
                "SELECT * FROM users WHERE id = ?",
                [req.user.id],
                (err, result) => {
                    if (err) {
                        return callback(
                            new ApiError(
                                500,
                                "Error fetching updated user data"
                            )
                        );
                    }

                    const { password, refreshToken, ...user } = result[0];

                    return res
                        .status(200)
                        .json(
                            new ApiResponse(
                                200,
                                user,
                                "Avatar updated successfully"
                            )
                        );
                }
            );
        }
    );
};

const updateCoverImage = async (req, res) => {
    const coverImageLocalPath = req.file?.path;

    if (!coverImageLocalPath) {
        throw new ApiError(400, "Avatar file is missing");
    }

    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if (!coverImage.url) {
        throw new ApiError(400, "Error while uploading on avatar");
    }

    db.query(
        "UPDATE users SET coverImage = ? WHERE id = ?",
        [coverImage.url, req.user.id],
        (err, result) => {
            if ((err, result)) {
                return callback(new ApiError(500, "Error to update avatar"));
            }

            if (result.affectedRows === 0) {
                throw new ApiError(404, "User not found");
            }

            db.query(
                "SELECT * FROM users WHERE id = ?",
                [req.user.id],
                (err, result) => {
                    if (err) {
                        return callback(
                            new ApiError(
                                500,
                                "Error fetching updated user data"
                            )
                        );
                    }

                    const { password, refreshToken, ...user } = result[0];

                    return res
                        .status(200)
                        .json(
                            new ApiResponse(
                                200,
                                user,
                                "Cover Image updated successfully"
                            )
                        );
                }
            );
        }
    );
};

const updateCurrentPassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
        throw new ApiError(400, "Required old and new Password");
    }

    const hashedPassword = await hashPassword(newPassword);

    db.query(
        "SELECT * FROM users WHERE id = ?",
        [req.user?.id],
        async (err, result) => {
            if (err) {
                throw new ApiError(500, "Failed to get user");
            }

            if (!result.length) {
                throw new ApiError(404, "User not found");
            }

            const user = result[0];

            const isPasswordCorrect = await comparePassword(
                oldPassword,
                user.password
            );

            if (!isPasswordCorrect) {
                throw new ApiError(400, "Invaild old password");
            }

            db.query(
                "UPDATE users SET password = ? WHERE id = ?",
                [hashedPassword, user.id],
                (err, result) => {
                    if (err) {
                        throw new ApiError(401, "Error to change password");
                    }

                    return res
                        .status(200)
                        .json(
                            new ApiResponse(
                                200,
                                {},
                                "Password changed successfully"
                            )
                        );
                }
            );
        }
    );
};

const searchUsers = async (req, res) => {
    const {query} = req.query;
    // console.log(query)
    db.query(
        "SELECT id, fullName, username, avatar FROM users WHERE fullName LIKE ? OR username LIKE ?",
        [`%${query}%`, `%${query}%`],
        (err, result) => {
            if (err) {
                console.error(err)
                return res
                    .status(500)
                    .json({ message: "User search failed", err });
            }
            return res.status(200).json({ data: result });
        }
    );
};

export {
    createUserSession,
    registerUser,
    verifyOTP,
    createUserInfo,
    loginUser,
    getUserById,
    getCurrentUser,
    logoutUser,
    updateAvatar,
    updateCoverImage,
    updateCurrentPassword,
    searchUsers
};
