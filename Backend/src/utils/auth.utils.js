import jwt from "jsonwebtoken";

export function generateAccessToken(user) {
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            username: user.username,
            fullName: user.fullName,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );
}

export function generateRefreshToken(user) {
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            username: user.username,
            fullName: user.fullName,
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    );
}

export function verifyToken(token, secret) {
    return jwt.verify(token, secret);
}