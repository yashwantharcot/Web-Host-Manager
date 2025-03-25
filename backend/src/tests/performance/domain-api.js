import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

const errorRate = new Rate('errors');

export const options = {
  stages: [
    { duration: '1m', target: 50 },  // Ramp up to 50 users
    { duration: '3m', target: 50 },  // Stay at 50 users
    { duration: '1m', target: 100 }, // Ramp up to 100 users
    { duration: '3m', target: 100 }, // Stay at 100 users
    { duration: '1m', target: 0 },   // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests must complete below 500ms
    errors: ['rate<0.1'],             // Error rate must be less than 10%
  },
};

const BASE_URL = 'http://localhost:3000/api';
let authToken = '';

export function setup() {
  // Login to get auth token
  const loginRes = http.post(`${BASE_URL}/auth/login`, JSON.stringify({
    email: 'admin@example.com',
    password: 'password123'
  }), {
    headers: { 'Content-Type': 'application/json' }
  });

  check(loginRes, {
    'login successful': (r) => r.status === 200
  });

  return { token: loginRes.json('token') };
}

export default function(data) {
  const headers = {
    'Authorization': `Bearer ${data.token}`,
    'Content-Type': 'application/json'
  };

  // Test GET /api/domains
  const listRes = http.get(`${BASE_URL}/domains`, { headers });
  check(listRes, {
    'list domains status is 200': (r) => r.status === 200,
    'list domains has data': (r) => r.json().length > 0
  }) || errorRate.add(1);

  sleep(1);

  // Test POST /api/domains
  const createRes = http.post(`${BASE_URL}/domains`, JSON.stringify({
    name: `test${Date.now()}.com`,
    registrar: 'GoDaddy',
    registrationDate: '2023-01-01',
    expiryDate: '2024-01-01',
    status: 'active',
    autoRenew: true
  }), { headers });

  check(createRes, {
    'create domain status is 201': (r) => r.status === 201
  }) || errorRate.add(1);

  sleep(1);

  // Test GET /api/domains/:id
  const domainId = createRes.json('id');
  const getRes = http.get(`${BASE_URL}/domains/${domainId}`, { headers });
  check(getRes, {
    'get domain status is 200': (r) => r.status === 200
  }) || errorRate.add(1);

  sleep(1);

  // Test PUT /api/domains/:id
  const updateRes = http.put(`${BASE_URL}/domains/${domainId}`, JSON.stringify({
    name: `updated${Date.now()}.com`,
    status: 'expired'
  }), { headers });

  check(updateRes, {
    'update domain status is 200': (r) => r.status === 200
  }) || errorRate.add(1);

  sleep(1);

  // Test DELETE /api/domains/:id
  const deleteRes = http.del(`${BASE_URL}/domains/${domainId}`, null, { headers });
  check(deleteRes, {
    'delete domain status is 200': (r) => r.status === 200
  }) || errorRate.add(1);

  sleep(1);

  // Test GET /api/domains/status/:status
  const statusRes = http.get(`${BASE_URL}/domains/status/active`, { headers });
  check(statusRes, {
    'filter by status status is 200': (r) => r.status === 200
  }) || errorRate.add(1);

  sleep(1);
} 