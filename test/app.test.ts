import assert from 'node:assert/strict';
import { after, before, describe, test } from 'node:test';
import { createServer, request as httpRequest, type Server } from 'node:http';
import { createLaunchpadApp } from '../src/app.js';

function request(
  url: string,
  method = 'GET'
): Promise<{ status: number; headers: Record<string, string>; body: string }> {
  return new Promise((resolve, reject) => {
    const outgoing = httpRequest(url, { method }, (incoming) => {
      let body = '';
      incoming.on('data', (chunk: Buffer) => {
        body += chunk.toString();
      });
      incoming.on('end', () => {
        const headers: Record<string, string> = {};
        for (const [name, value] of Object.entries(incoming.headers)) {
          if (typeof value === 'string') headers[name] = value;
        }
        resolve({ status: incoming.statusCode ?? 0, headers, body });
      });
      incoming.on('error', reject);
    });
    outgoing.on('error', reject);
    outgoing.end();
  });
}

describe('Orbit Launchpad HTTP app', () => {
  let server: Server;
  let baseUrl: string;

  before(async () => {
    server = createServer(createLaunchpadApp());
    await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
    const address = server.address();
    const port = typeof address === 'object' && address ? address.port : 0;
    baseUrl = `http://127.0.0.1:${port}`;
  });

  after(async () => {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  });

  test('serves the custom website through Orbit', async () => {
    const response = await request(`${baseUrl}/`);
    assert.equal(response.status, 200);
    assert.match(response.headers['content-type'] ?? '', /text\/html/);
    assert.match(response.body, /<h1>Launchpad<\/h1>/);
  });

  test('serves static assets from the configured public directory', async () => {
    const response = await request(`${baseUrl}/styles.css`);
    assert.equal(response.status, 200);
    assert.match(response.headers['content-type'] ?? '', /text\/css/);
    assert.match(response.body, /\.mission-hero/);
  });

  test('uses the custom not-found page', async () => {
    const response = await request(`${baseUrl}/missing`);
    assert.equal(response.status, 404);
    assert.match(response.body, /outside the flight plan/);
  });

  test('removes response bodies for HEAD requests', async () => {
    const response = await request(`${baseUrl}/api/status`, 'HEAD');
    assert.equal(response.status, 200);
    assert.match(response.headers['content-type'] ?? '', /application\/json/);
    assert.equal(response.body, '');
  });
});
