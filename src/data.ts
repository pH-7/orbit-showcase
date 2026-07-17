export type MissionStatus = 'Active' | 'Planned' | 'Review';

export interface Mission {
  slug: string;
  name: string;
  summary: string;
  status: MissionStatus;
  lead: string;
  orbit: string;
  completion: number;
  nextMilestone: string;
  window: string;
  signal: string;
  payload: string;
  accent: string;
}

export const missions: readonly Mission[] = [
  {
    slug: 'aurora-watch',
    name: 'Aurora Watch',
    summary: 'Maps charged-particle activity across polar regions for space-weather forecasting.',
    status: 'Active',
    lead: 'Dr. Mei Tan',
    orbit: 'LEO / 540 km',
    completion: 72,
    nextMilestone: 'Calibration pass 08',
    window: 'Today, 14:20 UTC',
    signal: 'Nominal',
    payload: 'UV spectrometer',
    accent: '#25b47e'
  },
  {
    slug: 'blue-current',
    name: 'Blue Current',
    summary: 'Tracks ocean surface temperature and current boundaries across the Pacific.',
    status: 'Active',
    lead: 'Andre Silva',
    orbit: 'SSO / 610 km',
    completion: 58,
    nextMilestone: 'Dataset release 12',
    window: 'Tomorrow, 02:45 UTC',
    signal: 'Nominal',
    payload: 'Multispectral imager',
    accent: '#289bd7'
  },
  {
    slug: 'forest-pulse',
    name: 'Forest Pulse',
    summary: 'Measures canopy health and wildfire recovery across vulnerable ecosystems.',
    status: 'Review',
    lead: 'Sofia Laurent',
    orbit: 'SSO / 575 km',
    completion: 89,
    nextMilestone: 'Science review',
    window: 'Jul 24, 09:00 UTC',
    signal: 'Data hold',
    payload: 'Hyperspectral camera',
    accent: '#f2a93b'
  },
  {
    slug: 'night-lattice',
    name: 'Night Lattice',
    summary: 'Creates low-light maps of urban expansion and regional energy resilience.',
    status: 'Planned',
    lead: 'Imani Brooks',
    orbit: 'LEO / 520 km',
    completion: 34,
    nextMilestone: 'Thermal vacuum test',
    window: 'Aug 04, 18:30 UTC',
    signal: 'Ground test',
    payload: 'Low-light radiometer',
    accent: '#d46a8c'
  },
  {
    slug: 'ice-line',
    name: 'Ice Line',
    summary: 'Observes seasonal sea-ice edges to improve navigation and climate models.',
    status: 'Active',
    lead: 'Noah Eriksen',
    orbit: 'Polar / 690 km',
    completion: 64,
    nextMilestone: 'Arctic downlink',
    window: 'Today, 21:10 UTC',
    signal: 'Nominal',
    payload: 'Synthetic aperture radar',
    accent: '#68b8c4'
  },
  {
    slug: 'terra-relay',
    name: 'Terra Relay',
    summary: 'Expands high-throughput downlink coverage for the observation fleet.',
    status: 'Planned',
    lead: 'Marcus Lee',
    orbit: 'MEO / 8,000 km',
    completion: 21,
    nextMilestone: 'Antenna integration',
    window: 'Sep 18, 11:15 UTC',
    signal: 'Integration',
    payload: 'Ka-band relay',
    accent: '#8c82d9'
  }
];

export function findMission(slug: string): Mission | undefined {
  return missions.find((mission) => mission.slug === slug);
}

export function filterMissions(status: string | null, query: string | null): Mission[] {
  const normalizedQuery = query?.trim().toLowerCase() ?? '';

  return missions.filter((mission) => {
    const matchesStatus = !status || status === 'All' || mission.status === status;
    const matchesQuery =
      !normalizedQuery ||
      `${mission.name} ${mission.summary} ${mission.lead}`.toLowerCase().includes(normalizedQuery);

    return matchesStatus && matchesQuery;
  });
}
