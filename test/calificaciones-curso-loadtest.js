import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  vus: 50,
  duration: '30s',
};

const BASE_URL = 'http://localhost:5000';

export default function () {
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer '
  };

  const res = http.get(
    `${BASE_URL}/calificacion/materia/:id_materia/curso/:id_curso/docente/:documento_docente/institucion/:id_institucion`,
    { headers }
  );

  console.log(`Status: ${res.status}`);

  check(res, {
    '✅ Status 200': (r) => r.status === 200,
    '⚡ Tiempo < 500ms': (r) => r.timings.duration < 500,
  });

  sleep(1);
}