import { createServer } from 'node:http';
import { createLaunchpadApp } from './app.js';

const host = process.env.HOST || '127.0.0.1';
const port = Number(process.env.PORT || 3000);

if (!Number.isInteger(port) || port < 0 || port > 65535) {
  throw new Error(`PORT must be an integer between 0 and 65535. Received: ${process.env.PORT}`);
}

const server = createServer(createLaunchpadApp());

server.on('error', (error) => {
  console.error('Orbit Launchpad failed to start.', error);
  process.exitCode = 1;
});

server.listen(port, host, () => {
  const address = server.address();
  const actualPort = typeof address === 'object' && address ? address.port : port;
  console.log(`Orbit Launchpad is running at http://${host}:${actualPort}`);
});
