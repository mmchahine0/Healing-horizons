const axios = require('axios');

// Your external API endpoint
const externalApiUrl = 'https://api.example.com/ask';

// Your controller function
async function askExternalApi(req, res) {
  try {
    // Get the user's question from the request body
    const { question } = req.body;

    // Make a POST request to the external API
    const response = await axios.post(externalApiUrl, { question }, {
      // Add headers if necessary, e.g., API key
      headers: {
        'Authorization': 'Bearer YOUR_API_KEY',
      },
    });

    // Return the API response to the client
    res.json(response.data);
  } catch (error) {
    // Handle any errors, e.g., send an error response to the client
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
}

module.exports = {
  askExternalApi,
};