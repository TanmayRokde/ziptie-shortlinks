const axios = require("axios");

MVP_BACKEND_URL = "https://ziptie-mvp-backend.vercel.app"

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

const createShortUrl = async ({ longUrl, ttl, private_key }) => {
  try {
    const response = await axios.post(`${MVP_BACKEND_URL}/api/shortlink/shorten`, {
      longUrl,
      ttl,
    }, {
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json',
        'private-key': private_key
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
