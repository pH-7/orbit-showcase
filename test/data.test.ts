import assert from 'node:assert/strict';
import test from 'node:test';
import { filterMissions, findMission, missions } from '../src/data.js';

test('mission slugs are unique', () => {
  assert.equal(new Set(missions.map((mission) => mission.slug)).size, missions.length);
});

test('findMission returns a matching mission', () => {
  assert.equal(findMission('aurora-watch')?.name, 'Aurora Watch');
});

test('filterMissions filters by status', () => {
  const planned = filterMissions('Planned', null);
  assert.ok(planned.length > 0);
  assert.ok(planned.every((mission) => mission.status === 'Planned'));
});

test('filterMissions searches names and descriptions case-insensitively', () => {
  assert.deepEqual(filterMissions(null, 'PACIFIC').map((mission) => mission.slug), [
    'blue-current'
  ]);
});
