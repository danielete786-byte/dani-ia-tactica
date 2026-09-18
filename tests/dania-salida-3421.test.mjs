import assert from 'node:assert/strict';
import test from 'node:test';
import { SALIDA_3421_TASKS, createSalida3421Task, resolveSalida3421Task } from '../vendor/board/src/dania-salida-3421.ts';
import { createDaniaTask, DANIA_TASK_GROUPS } from '../vendor/board/src/dania-authored-tasks.ts';
import { migrateProject } from '../vendor/board/src/projects.ts';

const players = board => board.scene.objects.filter(object => object.type === 'player');

test('the build-up session exposes three editable 3-4-2-1 tasks', () => {
  assert.deepEqual(SALIDA_3421_TASKS.map(task => task.key), ['salida-base', 'salida-lado', 'salida-colectiva']);
  assert.equal(new Set(SALIDA_3421_TASKS.map(task => task.id)).size, 3);
  assert.ok(DANIA_TASK_GROUPS.some(group => group.id === 'salida-3421'));
  for (const task of SALIDA_3421_TASKS) {
    const project = createDaniaTask(task.key, 123);
    assert.equal(project.updated, 123);
    assert.equal(project.boards.length, 3);
    assert.deepEqual(project.boards.map(board => board.title), [
      '1 · Estructura inicial', '2 · Movimientos de apoyo', '3 · Progresión',
    ]);
  }
});

for (const task of SALIDA_3421_TASKS) {
  test(`${task.key}: every board contains 20 anonymous players and three keepers`, () => {
    const project = createSalida3421Task(task.key, 0);
    const initialIds = players(project.boards[0]).map(player => player.id).sort();
    for (const board of project.boards) {
      const boardPlayers = players(board);
      assert.equal(boardPlayers.length, 20);
      assert.equal(boardPlayers.filter(player => player.id.includes('-keeper-')).length, 3);
      assert.deepEqual(boardPlayers.map(player => player.id).sort(), initialIds);
      assert.ok(boardPlayers.every(player => player.name === ''));
      assert.equal(new Set(board.scene.objects.map(object => object.id)).size, board.scene.objects.length);
      assert.match(board.note, /pivotes se lateralizan/i);
      assert.match(board.note, /mediapuntas bajan/i);
      assert.match(board.note, /un escalón por delante/i);
      for (const player of boardPlayers) {
        assert.ok(player.x - player.r >= 0 && player.x + player.r <= 800, `${board.title}: ${player.id}.x`);
        assert.ok(player.y - player.r >= 0 && player.y + player.r <= 640, `${board.title}: ${player.id}.y`);
      }
    }
  });

  test(`${task.key}: native migration preserves all boards, notes and identities`, () => {
    const project = createSalida3421Task(task.key, 123);
    const restored = migrateProject(JSON.parse(JSON.stringify(project)));
    assert.ok(restored);
    assert.equal(restored.boards.length, 3);
    for (let index = 0; index < 3; index++) {
      assert.deepEqual(restored.boards[index].scene.objects.map(object => object.id), project.boards[index].scene.objects.map(object => object.id));
      assert.equal(restored.boards[index].note, project.boards[index].note);
      assert.deepEqual(restored.boards[index].link, { dur: 2200, ease: 'in-out' });
      assert.ok(restored.boards[index].scene.objects.filter(object => object.type === 'text').every(object => object.size >= 20));
    }
  });
}

test('both group tasks use two fields of ten players', () => {
  for (const key of ['salida-base', 'salida-lado']) {
    const project = createSalida3421Task(key);
    for (const board of project.boards) {
      for (const field of [1, 2]) {
        const fieldPlayers = players(board).filter(player => player.id.startsWith(`${project.id}-field-${field}-`));
        assert.equal(fieldPlayers.length, 10);
        assert.equal(fieldPlayers.filter(player => player.id.includes('-rival-')).length, 3);
        assert.equal(fieldPlayers.filter(player => player.id.includes('-team-')).length, 5);
      }
    }
  }
});

test('the collective board represents a complete 3-4-2-1 against seven outfield opponents', () => {
  for (const board of createSalida3421Task('salida-colectiva').boards) {
    assert.equal(players(board).filter(player => player.id.includes('-team-')).length, 10);
    assert.equal(players(board).filter(player => player.id.includes('-rival-')).length, 7);
    assert.equal(board.scene.objects.filter(object => object.type === 'goal').length, 2);
    assert.match(board.note, /Equipo rojo completo en 3-4-2-1/);
  }
});

test('reopening a build-up task preserves the coach editing copy', () => {
  const edited = createSalida3421Task('salida-lado', 1);
  edited.name = 'Mi salida del lunes';
  edited.boards[0].note = 'Corrección personal';
  edited.boards[0].scene.objects[0].x = 42;
  const before = JSON.stringify(edited);
  const result = resolveSalida3421Task([edited], 'salida-lado', 2);
  assert.equal(result.created, false);
  assert.equal(result.project, edited);
  assert.equal(JSON.stringify(edited), before);
});
