const jwt = require('jsonwebtoken');
const JWT_SECRET = 'SohamIsagood$bOY';

const fetchUser = (req, res, next) => {
    try {
        const token = req.header('auth-token');

        if (!token) {
            return res.status(401).json({ error: "Please login to connectify" });
        }

        const data = jwt.verify(token, JWT_SECRET);

        if (!data.user) {
            throw new Error('Invalid token format');
        }

        req.user = data.user;
        next();
    } catch (error) {
        console.error("Error:", error.message);

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: "Invalid token" });
        }

        return res.status(401).json({ error: "Unexpected error while connecting with connectify" });
    }
}

module.exports = fetchUser;
