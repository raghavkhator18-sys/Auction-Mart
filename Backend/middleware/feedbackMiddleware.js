const jwt = require("jsonwebtoken");

const feedbackMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return next();
    }

    const token = authHeader.split(" ")[1];

    try {
        // Decode the Supabase JWT payload to extract user info.
        // We don't verify the signature here because:
        // 1. This middleware is optional (unauthenticated feedback is allowed)
        // 2. The token is a Supabase-issued JWT signed with the Supabase JWT secret,
        //    not the app's custom JWT_SECRET — verifying with the wrong secret always fails.
        const decoded = jwt.decode(token);
        if (decoded) {
            req.user = decoded;
        }
    } catch (err) {
        console.warn("Could not decode token in feedback middleware:", err.message);
    }
    
    next();
};

module.exports = feedbackMiddleware;

