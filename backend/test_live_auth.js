const axios = require('axios');

async function testRealLogin() {
    console.log("Testing POST http://localhost:5000/api/auth/login...");
    try {
        const response = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'admin@test.com',
            password: 'password123'
        });
        console.log("STATUS:", response.status);
        console.log("DATA:", JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.log("FAIL:", error.response?.status, error.response?.data || error.message);
    }
}

testRealLogin();
