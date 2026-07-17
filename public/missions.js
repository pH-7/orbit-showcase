const form = document.querySelector('#mission-filters');
const queryInput = document.querySelector('#mission-query');
const statusSelect = document.querySelector('#mission-status');
const results = document.querySelector('#mission-results');
const count = document.querySelector('#result-count');
const empty = document.querySelector('#empty-state');

function missionCard(mission) {
  const article = document.createElement('article');
  article.className = 'mission-card';
  article.style.setProperty('--mission-color', mission.accent);

  const top = document.createElement('div');
  top.className = 'card-top';
  const id = document.createElement('span');
  id.className = 'mission-id';
  id.textContent = `ORB-${mission.slug.slice(0, 3).toUpperCase()}`;
  const status = document.createElement('span');
  status.className = `status status-${mission.status.toLowerCase()}`;
  status.textContent = mission.status;
  top.append(id, status);

  const heading = document.createElement('h2');
  const headingLink = document.createElement('a');
  headingLink.href = `/missions/${mission.slug}`;
  headingLink.textContent = mission.name;
  heading.append(headingLink);

  const summary = document.createElement('p');
  summary.textContent = mission.summary;

  const details = document.createElement('dl');
  for (const [label, value] of [['Orbit', mission.orbit], ['Lead', mission.lead]]) {
    const row = document.createElement('div');
    const term = document.createElement('dt');
    const detail = document.createElement('dd');
    term.textContent = label;
    detail.textContent = value;
    row.append(term, detail);
    details.append(row);
  }

  const progress = document.createElement('div');
  progress.className = 'card-progress';
  const track = document.createElement('span');
  const fill = document.createElement('i');
  fill.style.width = `${mission.completion}%`;
  track.append(fill);
  const progressText = document.createElement('small');
  progressText.textContent = `${mission.completion}% complete`;
  progress.append(track, progressText);

  const link = document.createElement('a');
  link.className = 'text-link';
  link.href = `/missions/${mission.slug}`;
  link.textContent = 'Open mission ->';

  article.append(top, heading, summary, details, progress, link);
  return article;
}

async function applyFilters(event) {
  event.preventDefault();
  const params = new URLSearchParams();
  if (queryInput.value) params.set('q', queryInput.value);
  if (statusSelect.value !== 'All') params.set('status', statusSelect.value);

  const response = await fetch(`/api/missions?${params}`);
  if (!response.ok) {
    form.submit();
    return;
  }

  const payload = await response.json();
  results.replaceChildren(...payload.missions.map(missionCard));
  count.textContent = String(payload.count);
  empty.hidden = payload.count > 0;
  history.replaceState(null, '', params.size ? `/missions?${params}` : '/missions');
}

form?.addEventListener('submit', applyFilters);
statusSelect?.addEventListener('change', (event) => applyFilters(event));
