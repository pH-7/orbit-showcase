import { escapeHtml } from '@ph7/orbit';
import type { Mission } from './data.js';

type NavigationItem = 'Overview' | 'Missions' | 'Systems';

function navigation(active: NavigationItem): string {
  const items: Array<{ label: NavigationItem; href: string }> = [
    { label: 'Overview', href: '/' },
    { label: 'Missions', href: '/missions' },
    { label: 'Systems', href: '/systems' }
  ];

  return items
    .map(
      ({ label, href }) =>
        `<a href="${href}"${label === active ? ' aria-current="page"' : ''}>${label}</a>`
    )
    .join('');
}

function layout(title: string, active: NavigationItem, content: string, script = ''): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content="Orbit Launchpad mission operations showcase." />
    <meta name="theme-color" content="#101718" />
    <title>${escapeHtml(title)} | Orbit Launchpad</title>
    <link rel="preload" href="/assets/earth-observation.png" as="image" />
    <link rel="stylesheet" href="/styles.css" />
  </head>
  <body>
    <header class="topbar">
      <a class="brand" href="/" aria-label="Orbit Launchpad home">
        <span class="brand-mark" aria-hidden="true"></span>
        <span>ORBIT <b>Launchpad</b></span>
      </a>
      <nav aria-label="Primary navigation">${navigation(active)}</nav>
      <div class="system-state"><span aria-hidden="true"></span> All systems nominal</div>
    </header>
    ${content}
    <footer>
      <span>Orbit Launchpad</span>
      <span>Built with <a href="https://github.com/pH-7/orbit">@ph7/orbit</a></span>
    </footer>
    ${script ? `<script src="${script}" defer></script>` : ''}
  </body>
</html>`;
}

function statusPill(status: Mission['status']): string {
  return `<span class="status status-${status.toLowerCase()}">${status}</span>`;
}

function missionRows(items: readonly Mission[]): string {
  return items
    .map(
      (mission) => `<a class="mission-row" href="/missions/${mission.slug}">
        <span class="mission-color" style="--mission-color: ${mission.accent}"></span>
        <span class="mission-name"><b>${escapeHtml(mission.name)}</b><small>${escapeHtml(mission.orbit)}</small></span>
        <span>${statusPill(mission.status)}</span>
        <span class="mission-progress"><span><i style="width: ${mission.completion}%"></i></span><small>${mission.completion}%</small></span>
        <span class="mission-window"><b>${escapeHtml(mission.nextMilestone)}</b><small>${escapeHtml(mission.window)}</small></span>
        <span class="row-arrow" aria-hidden="true">&rarr;</span>
      </a>`
    )
    .join('');
}

export function renderHome(items: readonly Mission[]): string {
  const active = items.filter((mission) => mission.status === 'Active').length;

  return layout(
    'Overview',
    'Overview',
    `<main>
      <section class="mission-hero">
        <img src="/assets/earth-observation.png" alt="Earth observation satellite above the Pacific at dawn" />
        <div class="hero-copy">
          <p class="kicker">Mission operations / Day 184</p>
          <h1>Launchpad</h1>
          <p>One clear view of every mission, pass, and decision across the observation fleet.</p>
          <a class="primary-action" href="/missions">Open mission registry <span aria-hidden="true">&rarr;</span></a>
        </div>
        <div class="orbit-readout" aria-label="Current satellite readout">
          <span><small>Current track</small><b>South Pacific</b></span>
          <span><small>Altitude</small><b>540.2 km</b></span>
          <span><small>Velocity</small><b>7.61 km/s</b></span>
        </div>
      </section>

      <section class="metrics-band" aria-label="Fleet metrics">
        <div><small>Active missions</small><strong>${active}</strong><span class="trend positive">+1 this quarter</span></div>
        <div><small>Fleet availability</small><strong id="availability">99.97%</strong><span class="trend positive">Within target</span></div>
        <div><small>Data downlinked</small><strong id="downlink">18.42 TB</strong><span class="trend">Past 24 hours</span></div>
        <div><small>Next contact</small><strong id="contact">08:14</strong><span class="trend">Aurora Watch</span></div>
      </section>

      <section class="content-band">
        <div class="section-heading">
          <div><p class="kicker dark">Fleet activity</p><h2>Mission registry</h2></div>
          <a href="/missions">View all missions <span aria-hidden="true">&rarr;</span></a>
        </div>
        <div class="mission-table" aria-label="Current missions">${missionRows(items.slice(0, 4))}</div>
      </section>

      <section class="split-band">
        <div class="timeline">
          <div class="section-heading compact"><div><p class="kicker dark">Today</p><h2>Operations timeline</h2></div></div>
          <ol>
            <li><time>09:20</time><div><b>Ice Line downlink</b><span>12.8 GB received at Svalbard ground station</span></div></li>
            <li class="current"><time>11:45</time><div><b>Aurora Watch calibration</b><span>UV instrument alignment in progress</span></div></li>
            <li><time>14:20</time><div><b>Blue Current pass</b><span>Pacific sector multispectral capture</span></div></li>
            <li><time>18:05</time><div><b>Terra Relay review</b><span>Antenna integration readiness gate</span></div></li>
          </ol>
        </div>
        <aside class="system-panel">
          <p class="kicker">Live system feed</p>
          <h2>Ground network</h2>
          <dl>
            <div><dt>Svalbard</dt><dd><span class="dot online"></span>Online</dd></div>
            <div><dt>Canberra</dt><dd><span class="dot online"></span>Online</dd></div>
            <div><dt>Alaska</dt><dd><span class="dot standby"></span>Standby</dd></div>
          </dl>
          <a href="/systems">Inspect system health <span aria-hidden="true">&rarr;</span></a>
        </aside>
      </section>
    </main>`,
    '/app.js'
  );
}

export function renderMissions(items: readonly Mission[], status = 'All', query = ''): string {
  return layout(
    'Missions',
    'Missions',
    `<main class="page-shell">
      <header class="page-heading">
        <div><p class="kicker dark">Fleet registry</p><h1>Missions</h1></div>
        <p>Search every active, planned, and review-stage program in the observation fleet.</p>
      </header>
      <form class="filters" id="mission-filters" action="/missions" method="get">
        <label><span>Search missions</span><input id="mission-query" name="q" type="search" value="${escapeHtml(query)}" placeholder="Name, lead, or purpose" /></label>
        <label><span>Status</span><select id="mission-status" name="status">
          ${['All', 'Active', 'Planned', 'Review'].map((value) => `<option${value === status ? ' selected' : ''}>${value}</option>`).join('')}
        </select></label>
        <button type="submit">Apply filters</button>
      </form>
      <div class="results-summary"><span id="result-count">${items.length}</span> missions found</div>
      <section class="mission-grid" id="mission-results">${items.map(renderMissionCard).join('')}</section>
      <p class="empty-state" id="empty-state"${items.length ? ' hidden' : ''}>No missions match these filters.</p>
    </main>`,
    '/missions.js'
  );
}

function renderMissionCard(mission: Mission): string {
  return `<article class="mission-card" style="--mission-color: ${mission.accent}">
    <div class="card-top"><span class="mission-id">ORB-${mission.slug.slice(0, 3).toUpperCase()}</span>${statusPill(mission.status)}</div>
    <h2><a href="/missions/${mission.slug}">${escapeHtml(mission.name)}</a></h2>
    <p>${escapeHtml(mission.summary)}</p>
    <dl><div><dt>Orbit</dt><dd>${escapeHtml(mission.orbit)}</dd></div><div><dt>Lead</dt><dd>${escapeHtml(mission.lead)}</dd></div></dl>
    <div class="card-progress"><span><i style="width: ${mission.completion}%"></i></span><small>${mission.completion}% complete</small></div>
    <a class="text-link" href="/missions/${mission.slug}">Open mission <span aria-hidden="true">&rarr;</span></a>
  </article>`;
}

export function renderMissionDetail(mission: Mission): string {
  return layout(
    mission.name,
    'Missions',
    `<main class="page-shell detail-shell">
      <a class="back-link" href="/missions">&larr; Mission registry</a>
      <header class="detail-heading" style="--mission-color: ${mission.accent}">
        <div><span class="mission-id">ORB-${mission.slug.slice(0, 3).toUpperCase()}</span>${statusPill(mission.status)}</div>
        <h1>${escapeHtml(mission.name)}</h1>
        <p>${escapeHtml(mission.summary)}</p>
      </header>
      <section class="detail-grid">
        <div class="detail-main">
          <h2>Mission readiness</h2>
          <div class="large-progress"><span><i style="width: ${mission.completion}%"></i></span><strong>${mission.completion}%</strong></div>
          <div class="readiness-grid">
            <div><small>Payload</small><b>${escapeHtml(mission.payload)}</b></div>
            <div><small>Orbit</small><b>${escapeHtml(mission.orbit)}</b></div>
            <div><small>Signal</small><b>${escapeHtml(mission.signal)}</b></div>
            <div><small>Mission lead</small><b>${escapeHtml(mission.lead)}</b></div>
          </div>
          <h2>Current objective</h2>
          <div class="objective-row"><span>01</span><div><b>${escapeHtml(mission.nextMilestone)}</b><p>Scheduled for ${escapeHtml(mission.window)}. Flight and science teams are aligned for the next gate.</p></div></div>
        </div>
        <aside class="detail-aside">
          <p class="kicker">Next operation</p>
          <h2>${escapeHtml(mission.nextMilestone)}</h2>
          <time>${escapeHtml(mission.window)}</time>
          <hr />
          <dl><div><dt>Risk posture</dt><dd>Low</dd></div><div><dt>Open actions</dt><dd>3</dd></div><div><dt>Last contact</dt><dd>18 min ago</dd></div></dl>
        </aside>
      </section>
    </main>`
  );
}

export function renderSystems(): string {
  return layout(
    'Systems',
    'Systems',
    `<main class="page-shell">
      <header class="page-heading"><div><p class="kicker dark">Infrastructure</p><h1>Systems</h1></div><p>Live operational health across ground stations, APIs, and mission data services.</p></header>
      <section class="health-banner"><div><span class="dot online"></span><h2>All systems operational</h2></div><p>No incidents reported in the last 30 days.</p></section>
      <section class="service-list">
        ${[
          ['Mission API', '99.99%', '42 ms'],
          ['Telemetry pipeline', '99.97%', '1.2 s'],
          ['Svalbard ground station', '100%', 'Online'],
          ['Canberra ground station', '99.95%', 'Online'],
          ['Archive storage', '100%', '4.8 PB']
        ].map(([name, availability, detail]) => `<div><span class="dot online"></span><b>${name}</b><span>${availability}</span><small>${detail}</small></div>`).join('')}
      </section>
      <section class="api-callout"><div><p class="kicker">Public endpoint</p><h2>Machine-readable health</h2><p>Use the JSON status route for uptime checks and deployment health probes.</p></div><a href="/api/status">Open /api/status <span aria-hidden="true">&rarr;</span></a></section>
    </main>`
  );
}

export function renderNotFound(pathname: string): string {
  return layout(
    'Not found',
    'Overview',
    `<main class="not-found"><p class="kicker dark">404 / Off trajectory</p><h1>That route is outside the flight plan.</h1><p>We could not find <code>${escapeHtml(pathname)}</code>.</p><a class="primary-action dark-action" href="/">Return to Launchpad</a></main>`
  );
}
