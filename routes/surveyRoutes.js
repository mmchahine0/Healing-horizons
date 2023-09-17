const express = require('express');
const router = express.Router();
const surveyController = require('../controllers/surveyController');
const authController = require('../controllers/authController');

router.post('/submit', authController.protect, surveyController.submitSurvey);
router.get('/get/:userId', authController.protect, surveyController.getSurvey);

module.exports = router;