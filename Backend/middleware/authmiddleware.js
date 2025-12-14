const jwt = require("jsonwebtoken");
const User = require("../Model/UserModle");

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            // Get token from header
            token = req.headers.authorization.split(" ")[1];
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            // Get user from token
            req.user = await User.findById(decoded._id).select("-password");
            next();
        } catch (error) {
            res.status(401).json({ success: false, message: "Not authorized" });
        }
    }
    else {
        res.status(401).json({ success: false, message: "No token found" });
    }
}
 const adminOnly = (req, res, next) => {
    if (req.user.role !== "admin")
        return res.status(403).json({ message: "Admin access only" });
    next();
};

module.exports = { protect, adminOnly }