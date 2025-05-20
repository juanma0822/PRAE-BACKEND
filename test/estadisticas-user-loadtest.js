import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  vus: 50,
  duration: '30s',
};

const BASE_URL = 'https://prae-backend.up.railway.app';

export default function () {
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer '
  };

  const res = http.get(
    `${BASE_URL}/estadisticas/estudiante/:id_estudiante`,
    { headers }
  );

  console.log(`Status: ${res.status}`);

  check(res, {
    '✅ Status 200': (r) => r.status === 200,
    '⚡ Tiempo < 500ms': (r) => r.timings.duration < 500,
  });

  sleep(1);
}