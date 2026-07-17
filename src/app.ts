import { join } from 'node:path';
import { createApp } from '@ph7/orbit';
import { html } from './responses.js';
import { route } from './routes.js';
import { renderNotFound } from './views.js';

export function createLaunchpadApp() {
  return createApp({
    publicDir: join(process.cwd(), 'public'),
    route,
    notFound: ({ url }) => html(renderNotFound(url.pathname), 404)
  });
}
