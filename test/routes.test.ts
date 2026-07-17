import assert from 'node:assert/strict';
import test from 'node:test';
import type { OrbitRequest } from '@ph7/orbit';
import { route } from '../src/routes.js';

function request(pathname: string, method = 'GET'): OrbitRequest {
  return {
    method,
    request: {} as OrbitRequest['request'],
    url: new URL(pathname, 'http://localhost')
  };
}

test('home page is rendered by a custom Orbit route', () => {
  const response = route(request('/'));
  assert.equal(response?.status, 200);
  assert.match(response?.body ?? '', /<h1>Launchpad<\/h1>/);
});

test('mission detail routes resolve dynamically', () => {
  const response = route(request('/missions/aurora-watch'));
  assert.equal(response?.status, 200);
  assert.match(response?.body ?? '', /Aurora Watch/);
});

test('mission API supports status and search query parameters', () => {
  const response = route(request('/api/missions?status=Active&q=ice'));
  assert.equal(response?.status, 200);
  const body = JSON.parse(response?.body ?? '{}') as { count: number; missions: Array<{ slug: string }> };
  assert.equal(body.count, 1);
  assert.equal(body.missions[0]?.slug, 'ice-line');
});

test('status API identifies the Orbit framework', () => {
  const response = route(request('/api/status'));
  const body = JSON.parse(response?.body ?? '{}') as Record<string, unknown>;
  assert.equal(body.status, 'ok');
  assert.equal(body.framework, '@ph7/orbit');
});

test('API routes support CORS preflight', () => {
  const response = route(request('/api/status', 'OPTIONS'));
  assert.equal(response?.status, 204);
  assert.equal(response?.headers['access-control-allow-origin'], '*');
});

test('known routes reject unsupported methods', () => {
  const response = route(request('/missions', 'POST'));
  assert.equal(response?.status, 405);
  assert.equal(response?.headers.allow, 'GET, HEAD, OPTIONS');
});

test('unknown routes fall through to Orbit not-found handling', () => {
  assert.equal(route(request('/outside-flight-plan')), null);
});
