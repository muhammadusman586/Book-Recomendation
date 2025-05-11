import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const verifyToken = async (req, res, next) => {
    try {
        const token = req.header("Authorization");
        
        if (!token) {
            return res.status(401).json({ error: "Access Denied! No token provided." });
        }

        const extractedToken = token.replace("Bearer ", ""); 
        const decoded = jwt.verify(extractedToken, process.env.JWT_SECRET); 
        
        req.user = await User.findById(decoded.id);
        
        if (!req.user) {
            return res.status(401).json({ error: "User not found." });
        }
             

        next(); // Proceed to the next middleware
    } catch (error) {
        return res.status(401).json({ error: "Invalid or expired token." });
    }
};

export default verifyToken;