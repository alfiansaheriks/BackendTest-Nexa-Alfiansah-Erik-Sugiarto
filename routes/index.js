const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const karyawanRoutes = require('./karyawan.routes');


router.use(authRoutes);
router.use(karyawanRoutes);

module.exports = router;