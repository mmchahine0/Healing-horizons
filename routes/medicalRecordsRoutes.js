const express = require('express');
const router = express.Router();
const medicalRecordController = require('../controllers/medicalRecordsController');
const authController = require('../controllers/authController');

router.use(authController.protect);

router.post('/create', medicalRecordController.createMedicalRecord);
router.get('/getAUser/:userId', medicalRecordController.getSpecificUser);

module.exports = router;
