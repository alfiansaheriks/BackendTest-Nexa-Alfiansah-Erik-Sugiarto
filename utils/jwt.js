const jwt = require('jsonwebtoken');

const generateToken = (userId, timestamp) => {
    const payload = {
        userId,
        timestamp,
    };

    const secretKey = process.env.JWT_SECRET;
    const options = {
        expiresIn: '1h', 
    };

    const token = jwt.sign(payload, secretKey, options);
    //return token and expired
    const expiredAt = new Date(timestamp + 3600000).toISOString().slice(0, 19).replace('T', ' ');

    return { token, expiredAt };
}

module.exports = {
    generateToken
};