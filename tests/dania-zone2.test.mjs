import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { createZone2Task, resolveZone2Task, ZONE2_TASKS } from '../vendor/board/src/dania-zone2.ts';
import { frameAt, migrateProject, projectDuration } from '../vendor/board/src/projects.ts';
import { pitchById } from '../vendor/board/src/pitches.ts';

const players = board => board.scene.objects.filter(o => o.type === 'player');
const relays = board => players(board).filter(o => o.id.includes('-relay-'));
const inside = (point, rect) => point.x >= rect.x - rect.w / 2 && point.x <= rect.x + rect.w / 2
  && point.y >= rect.y - rect.h / 2 && point.y <= rect.y + rect.h / 2;
const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('three authored tasks, each with initial attack, counter-press and fallback; no warm-up', () => {
  assert.deepEqual(ZONE2_TASKS.map(t => t.key), ['parejas', 'trios', 'colectiva']);
  assert.equal(new Set(ZONE2_TASKS.map(t => t.id)).size, 3);
  for (const task of ZONE2_TASKS) {
    const project = createZone2Task(task.key, 123456);
    assert.equal(project.updated, 123456);
    assert.equal(project.id, task.id);
    assert.equal(project.boards.length, 3);
    assert.deepEqual(project.boards.map(b => b.title), [
      '1 · Organización inicial', '2 · Pérdida y presión', '3 · Si superan la presión',
    ]);
    assert.doesNotMatch(JSON.stringify(project), /calentamiento/i);
    for (const board of project.boards) {
      assert.match(board.note, /Un robo o una pérdida NO activa el relevo/);
      assert.match(board.note, /finalización o disparo fuera/);
      assert.match(board.note, /tercio central/);
      assert.match(board.note, /proteger el centro y replegar juntos/);
      assert.match(board.note, /no a escala/);
    }
  }
});

for (const task of ZONE2_TASKS) {
  test(`${task.key}: every phase keeps 20 distinct, anonymous players and two keepers`, () => {
    const project = createZone2Task(task.key, 0);
    const initialIds = players(project.boards[0]).map(p => p.id).sort();
    for (const board of project.boards) {
      assert.equal(players(board).length, 20);
      assert.equal(players(board).filter(p => p.id.includes('-keeper')).length, 2);
      assert.equal(players(board).filter(p => p.id.includes('-neutral-')).length, task.key === 'colectiva' ? 0 : 4);
      assert.deepEqual(players(board).map(p => p.id).sort(), initialIds);
      assert.ok(players(board).every(p => p.name === ''), 'no private roster assignments');
      assert.equal(new Set(board.scene.objects.map(o => o.id)).size, board.scene.objects.length);
      for (const p of players(board)) {
        assert.ok(p.x - p.r >= 0 && p.x + p.r <= 800);
        assert.ok(p.y - p.r >= 0 && p.y + p.r <= 640);
      }
      for (let i = 0; i < players(board).length; i++) {
        for (let j = i + 1; j < players(board).length; j++) {
          const a = players(board)[i], b = players(board)[j];
          assert.ok(Math.hypot(a.x - b.x, a.y - b.y) >= a.r + b.r + 4,
            `${board.title}: ${a.id} overlaps ${b.id}`);
        }
      }
    }
  });

  test(`${task.key}: waiting relays stay outside throughout the entire transition`, () => {
    const project = createZone2Task(task.key);
    const waiting = relays(project.boards[0]);
    assert.equal(waiting.length, task.key === 'parejas' ? 6 : task.key === 'trios' ? 2 : 4);
    for (const board of project.boards) {
      assert.deepEqual(relays(board), waiting);
      const fields = board.scene.objects.filter(o => o.type === 'box' && o.id.endsWith('-boundary'));
      for (const p of relays(board)) assert.ok(fields.every(field => !inside(p, field)));
    }
    // Sequence playback must not interpolate a waiting player onto the pitch.
    for (let time = 0; time <= projectDuration(project); time += 200) {
      const frame = frameAt(project, time);
      for (const p of waiting) {
        const animated = frame.scene.objects.find(o => o.id === p.id);
        assert.ok(animated);
        assert.equal(animated.x, p.x);
        assert.equal(animated.y, p.y);
      }
    }
  });

  test(`${task.key}: the loss takes place in zone 2; after bypass, the ball has left it`, () => {
    const project = createZone2Task(task.key);
    const loss = project.boards[1].scene;
    const fallback = project.boards[2].scene;
    const zones = loss.objects.filter(o => o.type === 'box' && o.id.endsWith('-zone2'));
    const balls = loss.objects.filter(o => o.type === 'ball');
    assert.equal(balls.length, task.key === 'colectiva' ? 1 : 2);
    assert.equal(zones.length, balls.length);
    for (const ball of balls) assert.equal(zones.filter(zone => inside(ball, zone)).length, 1);
    for (const ball of fallback.objects.filter(o => o.type === 'ball')) {
      assert.ok(zones.every(zone => !inside(ball, zone)));
    }
  });

  test(`${task.key}: native migration retains all phases, geometry, notes and identities`, () => {
    const project = createZone2Task(task.key, 123456);
    const restored = migrateProject(JSON.parse(JSON.stringify(project)));
    assert.ok(restored);
    assert.equal(restored.boards.length, 3);
    for (let index = 0; index < 3; index++) {
      const before = project.boards[index], after = restored.boards[index];
      assert.equal(after.scene.pitch, 'dania-session');
      assert.deepEqual(after.scene.board, { w: 800, h: 640 });
      assert.deepEqual(after.view, { x: 0, y: 0, w: 800, h: 640 });
      assert.equal(after.note, before.note);
      assert.deepEqual(after.link, { dur: 2200, ease: 'in-out' });
      assert.deepEqual(after.scene.objects.map(o => o.id), before.scene.objects.map(o => o.id));
      assert.equal(players(after).length, 20);
      for (const obj of after.scene.objects) {
        for (const [key, value] of Object.entries(obj)) {
          if (typeof value === 'number') assert.ok(Number.isFinite(value), `${obj.id}.${key}`);
        }
      }
      // The native SVG exporter enforces >=20px text; author at that size too.
      assert.ok(after.scene.objects.filter(o => o.type === 'text').every(o => o.size >= 20));
    }
  });
}

test('two simultaneous fields distribute ten players per field correctly', () => {
  for (const [key, active, waiting] of [['parejas', 2, 3], ['trios', 3, 1]]) {
    const project = createZone2Task(key);
    for (const board of project.boards) {
      for (const field of [1, 2]) {
        const local = players(board).filter(p => p.id.startsWith(`${project.id}-field-${field}-`));
        assert.equal(local.length, 10);
        assert.equal(local.filter(p => /-a-\d$/.test(p.id)).length, active);
        assert.equal(local.filter(p => /-b-\d$/.test(p.id)).length, active);
        assert.equal(local.filter(p => p.id.includes('-relay-')).length, waiting);
        assert.equal(local.filter(p => p.id.includes('-neutral-')).length, 2);
        assert.equal(local.filter(p => p.id.endsWith('-keeper')).length, 1);
      }
      assert.equal(board.scene.objects.filter(o => o.type === 'goal' && o.variant === 'normal').length, 2);
      assert.equal(board.scene.objects.filter(o => o.type === 'goal' && o.variant === 'small').length, 4);
    }
  }
});

test('collective task has seven outfield players per side and no neutral players', () => {
  for (const board of createZone2Task('colectiva').boards) {
    assert.equal(players(board).filter(p => /-a-\d$/.test(p.id)).length, 7);
    assert.equal(players(board).filter(p => /-b-\d$/.test(p.id)).length, 7);
    assert.equal(board.scene.objects.filter(o => o.type === 'goal').length, 2);
    assert.match(board.note, /R1\/R2 dos posiciones de A y a R3\/R4 dos de B/);
  }
});

test('fresh authored projects share no mutable scene, note or link state', () => {
  const first = createZone2Task('parejas', 1);
  const second = createZone2Task('parejas', 1);
  first.boards[0].scene.objects[0].x = -999;
  first.boards[0].link.dur = 600;
  first.boards[0].note = 'Mi nota';
  assert.equal(second.boards[0].scene.objects[0].x, 25);
  assert.equal(second.boards[0].link.dur, 2200);
  assert.notEqual(second.boards[0].note, 'Mi nota');
  assert.equal(first.boards[1].scene.objects[0].x, 25);
  assert.equal(first.boards[1].link.dur, 2200);
});

test('opening an authored task preserves renamed, reordered and edited working copies', () => {
  const original = createZone2Task('trios', 100);
  original.name = 'Mi variante del jueves';
  original.boards.reverse();
  original.boards[0].note = 'Esta es mi nota, no debe borrarse.';
  original.boards[0].scene.objects[0].x = 77;
  const unrelated = createZone2Task('parejas', 100);
  unrelated.id = 'existing-coach-project';
  const projects = [unrelated, original];
  const before = JSON.stringify(projects);
  const result = resolveZone2Task(projects, 'trios', 200);
  assert.equal(result.created, false);
  assert.equal(result.project, original);
  assert.equal(JSON.stringify(projects), before);
  const missing = resolveZone2Task(projects, 'colectiva', 300);
  assert.equal(missing.created, true);
  assert.equal(missing.project.updated, 300);
  assert.equal(JSON.stringify(projects), before, 'resolution itself never changes the library');
});

test('task background is built-in and independent of device-local uploaded images', () => {
  const pitch = pitchById('dania-session');
  assert.equal(pitch.id, 'dania-session');
  assert.equal(pitch.boardH, 640);
  assert.equal(pitch.sides, 1);
  assert.match(pitch.src, /^data:image\/svg\+xml/);
  assert.equal(pitch.custom, undefined);
});

test('task menu uses the existing save/open flow, guards failures and stays keyboard accessible', () => {
  const source = read('vendor/board/src/main.ts');
  assert.match(source, /<details class="dania-tasks" id="dania-tasks-menu">/);
  assert.match(source, /<summary>Tareas · Sesiones<\/summary>/);
  assert.match(source, /type="button" id="dania-task-\$\{task.key\}"/);
  assert.match(source, /si ya la editaste, se abre tu copia sin sobrescribirla/);
  const handler = source.slice(source.indexOf('function openDaniaTask('), source.indexOf('const daniaTasksMenu'));
  assert.ok(handler.indexOf('if (!saves.autosaveCurrent(true))') < handler.indexOf('resolveDaniaTask('));
  assert.match(handler, /if \(created\) \{\s*if \(!saves.persistProjectDocuments\(\[project\]\)\)/);
  assert.ok(handler.indexOf('saves.persistProjectDocuments') < handler.indexOf('library.projects.push'));
  assert.match(handler, /openLibraryProject\(project.id\)/);
  assert.match(source, /if \(openDaniaTask\(task.key\)\)/);
  assert.match(source, /daniaTasksMenu.addEventListener\('keydown',[\s\S]*?event.stopPropagation\(\)[\s\S]*?event.key === 'Escape'/);
  const css = read('vendor/board/src/dania-brand.css');
  assert.match(css, /width: min\(350px, calc\(100vw - 32px\)\)/);
  assert.match(css, /\.dania-task-menu button:focus-visible/);
});
