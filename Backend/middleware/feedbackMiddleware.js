const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "auctionmart_secret_key";

const feedbackMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return next();
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
    } catch (err) {
        console.warn("Invalid token in feedback middleware");
    }
    
    next();
};

module.exports = feedbackMiddleware;
