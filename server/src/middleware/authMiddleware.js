import jwt from "jsonwebtoken";

const authMiddleware = (req,res,next)=>{
    try{
        //here we are checking if user has token or not, if has then does that start with bearer, if user does not have valid token then invalod token response is sent.
        const authHeader = req.headers.authorization;
    
        if(!authHeader || !authHeader.startsWith("Bearer")){
            return res.status(401).json({
                message: "Unauthorized",
            })
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET,
        )

        req.user = decoded
        next()
    }catch(error){
        if(error.name === "TokenExpiredError"){
            return res.status(401).json({
                message: "Token Expired"
            })
        }

        if(error.name === "JsonWebTokenError"){
            return res.status(401).json({
                message: "Invalid Token"
            })
        }

        return res.status(500).json({
            message: "Internal Server Error",
        })
    }
}

export default authMiddleware;

/**
 * Frontend sends:

Authorization: Bearer JWT_TOKEN

Backend:

extracts token
verifies signature
decodes user
attaches user to request
 */