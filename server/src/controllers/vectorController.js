import { syncUserVectors } from "../vector/syncUserVectors.js";

export const syncVectors = async (req, res) => {
    try {
        console.log("req.user:", req.user)

        if (!req.user || !req.user.id) {
            return res.status(401).json({
                message: "User not authenticated or user ID missing"
            })
        }

        const result = await syncUserVectors(
            req.user.id
        )

        res.status(200).json({
            message: "Vectors sunchronized successfully",

            result
        })
    } catch (error) {
        console.log(error)

        res.status(500).json({
            message: "Vector sunchronization failed"
        })
    }
}