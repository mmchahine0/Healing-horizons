const cron = require('node-cron');
const Appointment = require('../models/appointmentModel.js');
const axios = require('axios');
const cron = require('node-cron');

// Get the CRON token
async function getCronToken() {
  try {
    const response = await axios.get('http://your-app-url/generate-cron-token');
    return response.data.token;
  } catch (error) {
    console.error('Error getting cron token:', error.message);
    return null;
  }
}

// Schedule the CRON job
cron.schedule('0 9 * * *', async () => {
  try {
    const cronToken = await getCronToken();

    if (cronToken) {
      // Include the cronToken in the headers of your requests to the protected routes
      const response = await axios.post(
        'http://your-app-url/send-appointment-reminders',
        {},
        { headers: { Authorization: `Bearer ${cronToken}` } }
      );

      console.log('Appointment reminder emails sent');
    }
  } catch (error) {
    console.error('Error sending appointment reminder emails:', error.message);
  }
});
