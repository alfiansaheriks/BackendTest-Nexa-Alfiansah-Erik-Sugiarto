const { generateNip } = require("../utils/generateNip");
const db = require("../config/db");

const storeKaryawan = async (req, res) => {
    try {
        const { nama, alamat, gend, bornDate } = req.body;

        if (!nama || !alamat || !gend || !bornDate) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
            ;
        }

        if (!req.file) {
            return res.status(400).json({ success: false, message: 'File is required' });
        }

        if (req.file.size > 20 * 1024) {
            return res.status(400).json({ success: false, message: 'Max photo size are 20KB' });
        }

        //handle special char
        // Validasi nama
        if (!/^[a-zA-Z\s.'-]+$/.test(nama)) {
            return res.status(400).json({ success: false, message: 'Name can only contain letters, spaces, dots, apostrophes, and dashes.' });
        }

        // Validasi alamat
        if (!/^[a-zA-Z0-9\s.,()\-\/#]+$/.test(alamat)) {
            return res.status(400).json({ success: false, message: 'Address contains invalid characters.' });
        }

        // Validasi gender
        if (!['L', 'P'].includes(gend.toUpperCase())) {
            return res.status(400).json({ success: false, message: 'Gender must be either "L" or "P".' });
        }

        // Validasi tanggal lahir
        if (isNaN(Date.parse(bornDate))) {
            return res.status(400).json({ success: false, message: 'Invalid date format for date of birth.' });
        }

        const nip = await generateNip();
        const randId = Math.floor(Math.random() * 1000);
        const mimeType = req.file.mimetype;
        const base64 = req.file.buffer.toString('base64');
        const image = `data:${mimeType};base64,${base64}`;

        const adminId = req.admin.userId;
        const [admin] = await db.query('SELECT * FROM admin WHERE id = ?', [adminId]);

        if (admin.length === 0) {
            return res.status(404).json({ success: false, message: 'Admin not found with id: ' });
        }

        const dataAdmin = admin[0];

        const [result] = await db.query(
            `INSERT INTO karyawan (nip, nama, alamat, gend, photo, tgl_lahir, id, insert_at, insert_by) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
            nip, nama, alamat, gend, image, bornDate, randId, new Date(), dataAdmin.username
        ]);

        if (result.affectedRows === 0) {
            return res.status(500).json({ success: false, message: 'Failed to add karyawan' });
        }

        const [karyawan] = await db.query('SELECT * FROM karyawan WHERE nip = ?', [result.nip]);

        res.status(201).json({ success: true, message: 'Karyawan added successfully', data: karyawan[0] });
    } catch (error) {
        console.error('Error adding karyawan:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

const getKaryawan = async (req, res) => {
    try {
        const { keyword = '', start = 0, count = 10 } = req.query;

        const offset = parseInt(start);
        const limit = parseInt(count);

        if (isNaN(offset) || isNaN(limit)) {
            return res.status(400).json({ message: 'Start and count must be numbers' });
        }

        if (keyword && /[<>;"'=%]/.test(keyword)) {
            return res.status(400).json({ message: 'Keyword contains invalid characters' });
        }

        const search = `%${keyword}%`;
        const [rows] = await db.query(
            `SELECT * FROM karyawan WHERE nama LIKE ? ORDER BY insert_at DESC LIMIT ? OFFSET ?`,
            [search, limit, offset]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: 'No data found' });
        }

        res.status(200).json({ success: true, data: rows, total: rows.length });
    } catch (error) {
        console.error('Error fetching karyawan:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const updateKaryawan = async (req, res) => {
    try {
        const { nip } = req.params;
        const { nama, alamat, gend, bornDate } = req.body;
        const { file } = req;
        const adminId = req.admin.userId;

        if (!nama || !alamat || !gend || !bornDate) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }
        if (!file) {
            return res.status(400).json({ success: false, message: 'File is required' });
        }
        // Validasi ukuran file
        if (file.size > 20 * 1024) {
            return res.status(400).json({ success: false, message: 'Max photo size are 20KB' });
        }

        //handle special char
        if (!/^[a-zA-Z\s.'-]+$/.test(nama)) {
            return res.status(400).json({ success: false, message: 'Name can only contain letters, spaces, dots, apostrophes, and dashes.' });
        }

        // Validasi alamat
        if (!/^[a-zA-Z0-9\s.,()\-\/#]+$/.test(alamat)) {
            return res.status(400).json({ success: false, message: 'Address contains invalid characters.' });
        }

        // Validasi gender
        if (!['L', 'P'].includes(gend.toUpperCase())) {
            return res.status(400).json({ success: false, message: 'Gender must be either "L" or "P".' });
        }

        // Validasi tanggal lahir
        if (isNaN(Date.parse(bornDate))) {
            return res.status(400).json({ success: false, message: 'Invalid date format for date of birth.' });
        }

        const mimeType = file.mimetype;
        const base64 = file.buffer.toString('base64');
        const image = `data:${mimeType};base64,${base64}`;
        const [admin] = await db.query('SELECT * FROM admin WHERE id = ?', [adminId]);
        
        if (admin.length === 0) {
            return res.status(404).json({ success: false, message: 'Admin not found' });
        }

        const dataAdmin = admin[0];

        const [result] = await db.query(
            `UPDATE karyawan SET nama = ?, alamat = ?, gend = ?, photo = ?, tgl_lahir = ?, update_at = ?, update_by = ? WHERE nip = ?`, [
            nama, alamat, gend, image, bornDate, new Date(), dataAdmin.username, nip
        ]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Karyawan not found' });
        }

        const [karyawan] = await db.query('SELECT * FROM karyawan WHERE nip = ?', [nip]);

        res.status(200).json({ success: true, message: 'Karyawan updated successfully', data: karyawan[0] });
    } catch (error) {
        console.error('Error updating karyawan:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

const updateKaryawanStatus = async (req, res) => {
    try {
        const { nip } = req.params;

        //handle character on nip
        if (!/^[0-9]+$/.test(nip)) {
            return res.status(400).json({ success: false, message: 'NIP contains invalid characters' });
        }

        const [karyawan] = await db.query('SELECT * FROM karyawan WHERE nip = ?', [nip]);

        if (karyawan.length === 0) {
            return res.status(404).json({ success: false, message: 'Karyawan not found' });
        }

        const [result] = await db.query(
            `UPDATE karyawan SET status = 9 WHERE nip = ?`, [
                nip
        ]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Karyawan not found' });
        }

        res.status(200).json({ success: true, message: 'Karyawan disabled successfully' });
    } catch (error) {
        console.error('Error updating karyawan status:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}


module.exports = {
    storeKaryawan,
    getKaryawan,
    updateKaryawan,
    updateKaryawanStatus
}