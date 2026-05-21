import jwt from "jsonwebtoken";
import crypto from "crypto";

export const generateAccessToken = (userId)=>{
    return jwt.sign(
        {id: userId},
        process.env.JWT_SECRET,
        {
            expiresIn: "15m"
        }
    )
}

export const generateRefreshToken = (userId)=>{
    return jwt.sign(
        {id: userId},
        process.env.JWT_REFRESH_SECRET,
        {
            expiresIn: "7d"
        }
    )
}

export const hashToken = (token) =>{
    return crypto.createHash("sha256").update(token).digest("hex");
}

export const generateResetToken = ()=>{

    // Reset Tokens should be cryptographycally random, unpredictable, high entropy
    return crypto.randomBytes(32).toString("hex")
}