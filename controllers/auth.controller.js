const db = require('../config/db');
const jwt = require('../utils/jwt');
const { decrypt, encrypt } = require('../utils/encrypt');

const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const [rows] = await db.query('SELECT * FROM admin WHERE username = ?', [username]);

        if (rows.length === 0) {
            return res.status(401).json({ "success": false, message: 'Invalid username' });
        }

        const admin = rows[0];
        
        const checkPassword = decrypt(password, admin.password);
        if (!checkPassword) {
            return res.status(401).json({ "success": false, message: 'Invalid password' });
        }

        const timeStamp = Date.now();
        const token = jwt.generateToken(admin.id, timeStamp);

        const saveToken = await db.query('INSERT INTO admin_token (id_admin, token, expired_at) VALUES (?, ?, ?)', [admin.id, token.token, token.expiredAt]);

        if (saveToken[0].affectedRows === 0) {
            return res.status(500).json({ "success": false, message: 'Failed to save token' });
        }

        res.status(200).json({
            "success": true,
            message: 'Login successful',
            token: token.token,
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ "success": false, message: 'Internal server error' });
    }
}

module.exports = {
    login
}
