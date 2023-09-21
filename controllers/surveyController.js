const User = require('../models/userModel.js');
const Survey = require('../models/surveyModel.js');

exports.submitSurvey = async (req, res) => {
  try {
    const { allergies, medicalHistory, criticalConditions, dateofbirth } = req.body;

    const user = await User.findById(req.user._id);
    const userSurvey = await Survey.findOne({ user: user });

    if (userSurvey) {
      userSurvey.allergies = allergies;
      userSurvey.medicalHistory = medicalHistory;
      userSurvey.criticalConditions = criticalConditions;
      userSurvey.dateofbirth = dateofbirth;
    } else {
      userSurvey = new Survey({
        user,
        allergies,
        medicalHistory,
        criticalConditions,
        dateofbirth,
      });
    }

    await userSurvey.save();

    res.status(200).json({ message: 'Survey submitted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

exports.getSurvey = async (req, res) => {
  try {
    const userId = req.params.userId;
    const userSurvey = await Survey.findOne({ user: userId });

    if (!userSurvey) {
      return res.status(404).json({ message: 'Survey not found' });
    }

    res.status(200).json(userSurvey);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};