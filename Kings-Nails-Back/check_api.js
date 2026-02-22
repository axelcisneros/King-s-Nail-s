const axios = require('axios').default;

async function run() {
  try {
  const base = 'http://127.0.0.1:5000/api';

    // Intento simple a la raíz
  const root = await axios.get('http://127.0.0.1:5000/');
    console.log('GET / status:', root.status);

    // Intento login
    const loginRes = await axios.post(`${base}/users/login`, {
      email: 'admin@kingsnails.test',
      password: 'admin123',
    }, { withCredentials: true });

    console.log('Login status:', loginRes.status);

    // Intento obtener stats usando la misma instancia (cookies no compartidas automáticamente)
    const statsRes = await axios.get(`${base}/admin/stats`, { withCredentials: true });
    console.log('Stats status:', statsRes.status);
    console.log('Stats body:', statsRes.data);
  } catch (err) {
    console.error('Error during checks:', err.message);
    if (err.response) console.error('Response:', err.response.status, err.response.data);
  }
}

run();
