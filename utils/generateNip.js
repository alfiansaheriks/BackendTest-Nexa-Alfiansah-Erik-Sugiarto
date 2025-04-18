const db = require('../config/db');

async function generateNip() {
    const year = new Date().getFullYear();
    const [rows] = await db.query('SELECT COUNT(*) AS total FROM karyawan WHERE nip LIKE ?', [`${year}%`]);
    const count = rows[0].total + 1;
    const counter = count.toString().padStart(4, '0');
    return `${year}${counter}`;
}

module.exports = {
    generateNip
};