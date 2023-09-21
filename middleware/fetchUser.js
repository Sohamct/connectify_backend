const jwt = require('jsonwebtoken');
const JWT_SECRET = 'SohamIsagood$bOY';

const fetchUser = (req, resp, next) => {
    // get the user form the jwt and id to req object.

    try {
        const token = req.header('auth-token');
        console.log("Comming...")
        if (!token) {
            console.log("no token...")
            return resp.status(401).send({ error: "Please login to connectify" });
        }

        console.log("Verifing ...");
        const data = jwt.verify(token, JWT_SECRET);
        console.log("Verified");
        req.user = data.user;
        next();
    } catch (error) {
        console.log("UNEXPECTED ERROR OCCURED")
        return resp.status(401).send({ error: "unexpected error while connecting with connectify" });
    }
}

module.exports = fetchUser;