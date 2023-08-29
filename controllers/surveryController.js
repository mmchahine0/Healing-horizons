const User = require('../models/userModel.js');
const Survey = require('../models/surveyModel');


exports.submitSurvey = async (req, res) => {
  try {
    const { allergies, medicalHistory, criticalConditions } = req.body;

    const existingSurvey = await Survey.findOne({ user: req.user._id });
    if (existingSurvey && existingSurvey.done) {
      return res.status(400).json({ message: 'Survey already submitted' });
    } const newSurvey = new Survey({
      user: req.user._id,
      allergies,
      medicalHistory,
      criticalConditions,
      done: true
    });

    await newSurvey.save();

    res.status(200).json({ message: 'Survey submitted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

exports.getSurvey = async (req, res) => {
  try {
    const userSurvey = await Survey.findOne({ user: req.user._id });
    if (!userSurvey) {
      return res.status(404).json({ message: 'Survey not found' });
    }
    res.status(200).json(userSurvey);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};