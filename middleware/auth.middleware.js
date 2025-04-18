const jwt = require('jsonwebtoken');

const authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ 
            success: false, 
            message: 'No token provided' 
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.admin = payload;
        next();
    } catch {
        return res.status(401).json({ 
            success: false, 
            message: 'Invalid token' 
        });
    }
}

module.exports= {
    authenticate
}