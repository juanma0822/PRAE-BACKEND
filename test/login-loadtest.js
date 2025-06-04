import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  vus: 30,
  duration: '30s',
};

export default function () {
  const payload = JSON.stringify({
    email: __ENV.TEST_USER_EMAIL,
    password: __ENV.TEST_USER_PASSWORD,
  });

  const headers = { 'Content-Type': 'application/json' };

  const res = http.post('http://localhost:5000/auth/Login', payload, { headers });

  console.log(`Status: ${res.status}, body: ${res.body}`);

  check(res, {
    '✅ Status 200': (r) => r.status === 200,
    '⚡ Tiempo < 500ms': (r) => r.timings.duration < 500,
  });

  sleep(1);
}
