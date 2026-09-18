import assert from 'node:assert/strict';
import test from 'node:test';
import { ATAQUE_MC_23_TASKS, createAtaqueMc23Task, resolveAtaqueMc23Task } from '../vendor/board/src/dania-ataque-mc-23.ts';
import { DANIA_TASK_GROUPS } from '../vendor/board/src/dania-authored-tasks.ts';

const players = board => board.scene.objects.filter(object => object.type === 'player');

test('the MC distribution session exposes three editable tasks for 23 players', () => {
  assert.deepEqual(ATAQUE_MC_23_TASKS.map(task => task.key), ['ataque-mc-posesion', 'ataque-mc-progresion', 'ataque-mc-partido']);
  assert.ok(DANIA_TASK_GROUPS.some(group => group.id === 'ataque-mc-23'));
  for (const task of ATAQUE_MC_23_TASKS) {
    const project = createAtaqueMc23Task(task.key, 1);
    assert.equal(project.id, task.id);
    assert.equal(project.boards.length, 3);
    assert.deepEqual(project.boards.map(board => board.scene.pitch), ['dania-session', 'dania-session', 'dania-session']);
    assert.ok(project.boards.every(board => board.note.includes('MIRA, PERFÍLATE Y CAMBIA')));
  }
});

test('all diagrams account for the full squad and the three keepers', () => {
  for (const task of ATAQUE_MC_23_TASKS) {
    for (const board of createAtaqueMc23Task(task.key, 1).boards) {
      const labels = players(board).map(object => object.label);
      assert.equal(labels.filter(label => /^P[123]$/.test(label)).length, 3);
      assert.equal(players(board).length, 23);
    }
  }
});

test('the possession and collective tasks show the two MC roles', () => {
  for (const key of ['ataque-mc-posesion', 'ataque-mc-partido']) {
    for (const board of createAtaqueMc23Task(key, 1).boards) {
      const labels = players(board).map(object => object.label);
      assert.ok(labels.includes('MC1'));
      assert.ok(labels.includes('MC2'));
    }
  }
});

test('existing edited projects are preserved', () => {
  const edited = createAtaqueMc23Task('ataque-mc-progresion', 1);
  edited.name = 'Mi variante de ataque organizado';
  const result = resolveAtaqueMc23Task([edited], 'ataque-mc-progresion', 2);
  assert.equal(result.created, false);
  assert.equal(result.project.name, 'Mi variante de ataque organizado');
});
