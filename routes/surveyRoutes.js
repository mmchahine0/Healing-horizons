const express = require('express');
const router = express.Router();
const surveyController = require('../controllers/surveyController');
authController = require('../controllers/authController');

router.post('/submit', authController.protect, surveyController.submitSurvey);
router.get('/get', authController.protect, surveyController.getSurvey);

module.exports = router;