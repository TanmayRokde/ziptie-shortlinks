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

module.exports = { checkHealth };
