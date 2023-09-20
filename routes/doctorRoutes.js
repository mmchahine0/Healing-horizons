const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const doctorController = require('../controllers/doctorController');

router.post('/update-office-hours', authController.protect, doctorController.updateOfficeHours);
router.post('/update-bio', authController.protect, doctorController.fillBio);
router.post('/specialty', authController.protect, doctorController.chooseSpecialty);
router.get('/getspecialty/:specialty', authController.protect, doctorController.getSpeciality)
router.get('/get', authController.protect, doctorController.getDoctors)
router.get('/getspecific/:userId', authController.protect, doctorController.getADoctor)
router.get('/getOffice/:userId', authController.protect, doctorController.getOfficeHours)


module.exports = router;