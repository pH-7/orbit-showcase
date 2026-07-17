import type { OrbitRequest, RouteResponse } from '@ph7/orbit';
import { filterMissions, findMission, missions } from './data.js';
import { html, json, methodNotAllowed, options } from './responses.js';
import {
  renderHome,
  renderMissionDetail,
  renderMissions,
  renderSystems
} from './views.js';

const knownPages = new Set(['/', '/missions', '/systems']);

export function route({ method, url }: OrbitRequest): RouteResponse | null {
  const pathname = url.pathname;

  if (method === 'OPTIONS' && pathname.startsWith('/api/')) {
    return options();
  }

  const isRead = method === 'GET' || method === 'HEAD';
  const missionSlug = pathname.match(/^\/missions\/([a-z0-9-]+)$/)?.[1];
  const knownRoute = knownPages.has(pathname) || Boolean(missionSlug) || pathname.startsWith('/api/');

  if (!isRead) {
    return knownRoute ? methodNotAllowed() : null;
  }

  if (pathname === '/') {
    return html(renderHome(missions));
  }

  if (pathname === '/missions') {
    const status = url.searchParams.get('status') ?? 'All';
    const query = url.searchParams.get('q') ?? '';
    return html(renderMissions(filterMissions(status, query), status, query));
  }

  if (missionSlug) {
    const mission = findMission(missionSlug);
    return mission ? html(renderMissionDetail(mission)) : null;
  }

  if (pathname === '/systems') {
    return html(renderSystems());
  }

  if (pathname === '/api/missions') {
    const filtered = filterMissions(url.searchParams.get('status'), url.searchParams.get('q'));
    return json({ count: filtered.length, missions: filtered });
  }

  if (pathname === '/api/status') {
    return json({
      name: 'Orbit Launchpad',
      status: 'ok',
      framework: '@ph7/orbit',
      frameworkVersion: '0.2.0',
      uptimeSeconds: Math.round(process.uptime()),
      timestamp: new Date().toISOString()
    });
  }

  if (pathname === '/api/telemetry') {
    const seconds = Math.floor(Date.now() / 1000);
    return json({
      availability: `${(99.95 + (seconds % 3) / 100).toFixed(2)}%`,
      downlinkTerabytes: (18.4 + (seconds % 10) / 100).toFixed(2),
      nextContactMinutes: 8,
      nextContactSeconds: seconds % 60
    });
  }

  return null;
}
