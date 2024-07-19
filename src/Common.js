const axios = require('axios');

async function fetchLocations() {
  const apiUrl = 'https://api.data.gov.in/resource/9115b89c-7a80-4f54-9b06-21086e0f0bd7';
  const apiKey = '579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b';
  const format = 'json';

  try {
    const response = await axios.get(`${apiUrl}?api-key=${apiKey}&format=${format}`);
    return response.data.records;
  } catch (error) {
    console.error('Error fetching locations:', error);
    return [];
  }
}

