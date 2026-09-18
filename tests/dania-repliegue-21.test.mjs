import assert from 'node:assert/strict';
import test from 'node:test';
import { REPLIEGUE_21_TASKS, createRepliegue21Task, resolveRepliegue21Task } from '../vendor/board/src/dania-repliegue-21.ts';
import { createDaniaTask, DANIA_TASK_GROUPS } from '../vendor/board/src/dania-authored-tasks.ts';
import { migrateProject } from '../vendor/board/src/projects.ts';

const players = board => board.scene.objects.filter(object => object.type === 'player');
const relays = board => players(board).filter(object => object.id.includes('-relay-'));

test('the defensive session exposes three editable tasks for 21 players', () => {
  assert.deepEqual(REPLIEGUE_21_TASKS.map(task => task.key), ['repliegue-pasillos', 'repliegue-oleadas', 'repliegue-partido']);
  assert.equal(new Set(REPLIEGUE_21_TASKS.map(task => task.id)).size, 3);
  assert.ok(DANIA_TASK_GROUPS.some(group => group.id === 'repliegue-21'));
  for (const task of REPLIEGUE_21_TASKS) {
    const project = createDaniaTask(task.key, 123);
    assert.equal(project.updated, 123);
    assert.equal(project.boards.length, 3);
    assert.match(project.boards[1].title, /Presión superada/);
    for (const board of project.boards) {
      assert.match(board.note, /VUELTA, DENTRO Y JUNTOS/);
      assert.match(board.note, /no activan el cambio/i);
    }
  }
});

for (const task of REPLIEGUE_21_TASKS) {
  test(`${task.key}: every phase keeps 21 anonymous players and two keepers`, () => {
    const project = createRepliegue21Task(task.key, 0);
    const identities = players(project.boards[0]).map(player => player.id).sort();
    for (const board of project.boards) {
      const boardPlayers = players(board);
      assert.equal(boardPlayers.length, 21);
      assert.equal(boardPlayers.filter(player => player.id.includes('-keeper-')).length, 2);
      assert.deepEqual(boardPlayers.map(player => player.id).sort(), identities);
      assert.ok(boardPlayers.every(player => player.name === ''));
      assert.equal(new Set(board.scene.objects.map(object => object.id)).size, board.scene.objects.length);
      for (const player of boardPlayers) {
        assert.ok(player.x - player.r >= 0 && player.x + player.r <= 800, `${board.title}: ${player.id}.x`);
        assert.ok(player.y - player.r >= 0 && player.y + player.r <= 640, `${board.title}: ${player.id}.y`);
      }
    }
  });

  test(`${task.key}: migration keeps all three moments, notes and identities`, () => {
    const project = createRepliegue21Task(task.key, 321);
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

  test(`${task.key}: waiting relays stay fixed until the action ends`, () => {
    const project = createRepliegue21Task(task.key);
    const waiting = relays(project.boards[0]);
    const expected = task.key === 'repliegue-pasillos' ? 3 : task.key === 'repliegue-oleadas' ? 6 : 3;
    assert.equal(waiting.length, expected);
    for (const board of project.boards) assert.deepEqual(relays(board), waiting);
  });
}

test('the three corridors distribute seven players each', () => {
  for (const board of createRepliegue21Task('repliegue-pasillos').boards) {
    for (const lane of [1, 2, 3]) {
      const local = players(board).filter(player => player.id.startsWith(`dania-repliegue-pasillos-21-v1-lane-${lane}-`));
      assert.equal(local.length, 7);
      assert.equal(local.filter(player => player.id.includes('-defend-')).length, 3);
      assert.equal(local.filter(player => player.id.includes('-relay-')).length, 1);
    }
  }
});

test('the wave task uses three teams of six, one joker and two goalkeepers', () => {
  for (const board of createRepliegue21Task('repliegue-oleadas').boards) {
    assert.equal(players(board).filter(player => player.id.includes('-attack-')).length, 6);
    assert.equal(players(board).filter(player => player.id.includes('-defend-')).length, 6);
    assert.equal(players(board).filter(player => player.id.includes('-relay-')).length, 6);
    assert.equal(players(board).filter(player => player.id.includes('-joker-')).length, 1);
  }
});

test('the final game is 8v8 with two keepers and three relays', () => {
  for (const board of createRepliegue21Task('repliegue-partido').boards) {
    assert.equal(players(board).filter(player => player.id.includes('-attack-')).length, 8);
    assert.equal(players(board).filter(player => player.id.includes('-defend-')).length, 8);
    assert.equal(players(board).filter(player => player.id.includes('-relay-')).length, 3);
    assert.match(board.note, /4-3-1/);
  }
});

test('reopening a defensive task preserves the coach editing copy', () => {
  const edited = createRepliegue21Task('repliegue-oleadas', 1);
  edited.name = 'Mi variante de repliegue';
  edited.boards[0].note = 'Corrección personal';
  edited.boards[0].scene.objects[0].x = 42;
  const before = JSON.stringify(edited);
  const result = resolveRepliegue21Task([edited], 'repliegue-oleadas', 2);
  assert.equal(result.created, false);
  assert.equal(result.project, edited);
  assert.equal(JSON.stringify(edited), before);
});
