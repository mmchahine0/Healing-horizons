const express = require('express');
const router = express.Router();
const medicalRecordController = require('../controllers/medicalRecordsController');
const authController = require('../controllers/authController');

router.use(authController.protect);

router.post('/create', medicalRecordController.createMedicalRecord);

module.exports = router;
