const axios = require('axios');

async function testEndpoints() {
  const endpoints = ['/user/profile', '/auth/me', '/auth/profile', '/users/me'];
  
  for (const endpoint of endpoints) {
    try {
      const res = await axios.get(`http://localhost:3000${endpoint}`);
      console.log(`Success ${endpoint}:`, res.status);
    } catch (err) {
      console.log(`Error ${endpoint}:`, err.response ? err.response.status : err.message);
    }
  }
}

testEndpoints();
