import assert from 'node:assert/strict';
import test from 'node:test';
import { ULTIMO_PASE_22_TASKS, createUltimoPase22Task, resolveUltimoPase22Task } from '../vendor/board/src/dania-ultimo-pase-22.ts';
import { createDaniaTask, DANIA_TASK_GROUPS } from '../vendor/board/src/dania-authored-tasks.ts';
import { migrateProject } from '../vendor/board/src/projects.ts';

const players = board => board.scene.objects.filter(object => object.type === 'player');

test('the last-pass session exposes three editable tasks for 22 players', () => {
  assert.deepEqual(ULTIMO_PASE_22_TASKS.map(task => task.key), ['ultimo-pase-superioridad', 'ultimo-pase-oleadas', 'ultimo-pase-partido']);
  assert.equal(new Set(ULTIMO_PASE_22_TASKS.map(task => task.id)).size, 3);
  assert.ok(DANIA_TASK_GROUPS.some(group => group.id === 'ultimo-pase-22'));
  for (const task of ULTIMO_PASE_22_TASKS) {
    const project = createDaniaTask(task.key, 123);
    assert.equal(project.updated, 123);
    assert.equal(project.boards.length, 3);
    assert.match(project.boards[1].title, /Último pase/);
    for (const board of project.boards) {
      assert.match(board.note, /MIRA, FIJA Y FILTRA/);
      assert.match(board.note, /no activan el cambio/i);
    }
  }
});

for (const task of ULTIMO_PASE_22_TASKS) {
  test(`${task.key}: every phase keeps 22 anonymous players and three keepers`, () => {
    const project = createUltimoPase22Task(task.key, 0);
    const identities = players(project.boards[0]).map(item => item.id).sort();
    for (const board of project.boards) {
      const boardPlayers = players(board);
      assert.equal(boardPlayers.length, 22);
      assert.equal(boardPlayers.filter(item => item.id.includes('-keeper-')).length, 3);
      assert.deepEqual(boardPlayers.map(item => item.id).sort(), identities);
      assert.ok(boardPlayers.every(item => item.name === ''));
      assert.equal(new Set(board.scene.objects.map(object => object.id)).size, board.scene.objects.length);
      for (const item of boardPlayers) {
        assert.ok(item.x - item.r >= 0 && item.x + item.r <= 800, `${board.title}: ${item.id}.x`);
        assert.ok(item.y - item.r >= 0 && item.y + item.r <= 640, `${board.title}: ${item.id}.y`);
      }
    }
  });

  test(`${task.key}: migration keeps all moments, notes and player identities`, () => {
    const project = createUltimoPase22Task(task.key, 321);
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

test('the first task splits the 22 players into two groups of eleven', () => {
  for (const board of createUltimoPase22Task('ultimo-pase-superioridad').boards) {
    const boardPlayers = players(board);
    const left = boardPlayers.filter(item => item.id.includes('-left-') || item.id.endsWith('-keeper-1'));
    const right = boardPlayers.filter(item => item.id.includes('-right-') || item.id.endsWith('-keeper-2') || item.id.endsWith('-keeper-3'));
    assert.equal(left.length, 11);
    assert.equal(right.length, 11);
    assert.equal(boardPlayers.filter(item => item.id.includes('-relay-')).length, 8);
  }
});

test('the wave task uses three teams of six, one attacking midfielder and three keepers', () => {
  for (const board of createUltimoPase22Task('ultimo-pase-oleadas').boards) {
    assert.equal(players(board).filter(item => item.id.includes('-attack-')).length, 6);
    assert.equal(players(board).filter(item => item.id.includes('-defend-')).length, 6);
    assert.equal(players(board).filter(item => item.id.includes('-relay-')).length, 6);
    assert.equal(players(board).filter(item => item.id.includes('-joker-')).length, 1);
  }
});

test('the final game completes a 3-4-2-1 with the neutral striker', () => {
  for (const board of createUltimoPase22Task('ultimo-pase-partido').boards) {
    assert.equal(players(board).filter(item => item.id.includes('-attack-')).length, 9);
    assert.equal(players(board).filter(item => item.id.includes('-defend-')).length, 9);
    assert.equal(players(board).filter(item => item.id.includes('-joker-')).length, 1);
    assert.match(board.note, /3-4-2-1/);
    assert.match(board.note, /Cada portero juega 18 minutos y descansa 9/);
  }
});

test('reopening a last-pass task preserves the coach editing copy', () => {
  const edited = createUltimoPase22Task('ultimo-pase-partido', 1);
  edited.name = 'Mi variante de último pase';
  edited.boards[0].note = 'Corrección personal';
  edited.boards[0].scene.objects[0].x = 42;
  const before = JSON.stringify(edited);
  const result = resolveUltimoPase22Task([edited], 'ultimo-pase-partido', 2);
  assert.equal(result.created, false);
  assert.equal(result.project, edited);
  assert.equal(JSON.stringify(edited), before);
});
