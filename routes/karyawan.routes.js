const express = require('express');
const router = express.Router();
const { 
    storeKaryawan,
    getKaryawan,
    updateKaryawan,
    updateKaryawanStatus
} = require('../controllers/karyawan.controller');
const upload = require('../utils/photo');
const { authenticate } = require('../middleware/auth.middleware');


router.post('/karyawan', upload.single('photo'), authenticate, storeKaryawan);
router.get('/karyawan', authenticate, getKaryawan);
router.put('/karyawan/:nip', authenticate, upload.single('photo'), updateKaryawan);
router.post('/karyawan/status/:nip', authenticate, updateKaryawanStatus);

module.exports = router;