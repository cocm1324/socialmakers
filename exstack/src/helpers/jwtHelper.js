const jwt = require("jsonwebtoken");

const getJwtKey = "Hello, what is it?";
const jwtHelper = {
    createToken: (subject, expiration, admin) => {
        const payload = {
            subject: subject,
            expiration: expiration,
            admin: admin
        }
        return jwt.sign(payload, getJwtKey);
    },
    unmarshallToken: (token) => {
        const payload = jwt.verify(token, getJwtKey);
        if (!payload) {
            return false;
        }

        return payload;
    }
}

module.exports = jwtHelper;