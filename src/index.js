const axios = require("axios");

async function checkHealth(endpoint = "/is-healthy") {
  try {
    const url = `https://dede-hammiest-mitsue.ngrok-free.dev/student/${endpoint}`;
    const response = await axios.get(url);
    return {
      success: true,
      status: response.status,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      status: error.response?.status || 500,
    };
  }
}

const createShortUrl = async ({ longUrl, userId, ttl }) => {
  try {
    const response = await axios.post(`${process.env.MVP_BACKEND_URL}/shorten`, {
      longUrl,
      userId,
      ttl
    }, {
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Failed to create short URL');
    }
    throw new Error('URL shortener service is unavailable');
  }
};

module.exports = { checkHealth, createShortUrl };
