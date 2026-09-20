import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import {
  DEFAULT_SESSION_ID,
  REPLIEGUE_21_SESSION_ID,
  SALIDA_3421_SESSION_ID,
  ULTIMO_PASE_22_SESSION_ID,
  ATAQUE_MC_23_SESSION_ID,
  buildSessionExportHtml,
  createDefaultDaniaSession,
  createDefaultSessionLibrary,
  createRepliegue21Session,
  createSalida3421Session,
  createUltimoPase22Session,
  createAtaqueMc23Session,
  normalizeSessionLibrary,
  sessionDownloadName,
  sessionTaskMinutes,
} from '../vendor/board/src/dania-session-planner.ts';

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('the authored Wednesday session carries the confirmed attendance and venue constraints', () => {
  const session = createDefaultDaniaSession();
  assert.equal(session.id, DEFAULT_SESSION_ID);
  assert.equal(session.team, 'Infantil Demo Albolote');
  assert.equal(session.day, 'Miércoles');
  assert.equal(session.arrivalTime, '19:45');
  assert.match(session.arrivalInstruction, /sin las botas puestas/i);
  assert.match(session.field, /Campo chico/i);
  assert.match(session.field, /espacio muy limitado/i);
  assert.equal(session.participants, 20);
  assert.equal(session.goalkeepers, 2);
  assert.match(session.availableGoalkeepers, /Eric Marín Soto/);
  assert.match(session.availableGoalkeepers, /Tomás Álvarez Rico/);
  for (const absent of ['Adam Navarro', 'José Luis Castro', 'Jad Benali', 'Daniel Campos', 'Víctor Méndez']) {
    assert.match(session.absences, new RegExp(absent));
  }
  assert.equal(session.coachCount, 1);
  assert.equal(session.durationMin, 70);
  assert.equal(sessionTaskMinutes(session), 65);
});

test('the session uses a short warm-up, two simultaneous group tasks and a 7v7 collective', () => {
  const session = createDefaultDaniaSession();
  assert.equal(session.tasks.length, 4);
  assert.deepEqual(session.tasks.map(task => task.diagram || null), [null, 'parejas', 'trios', 'colectiva']);
  assert.match(session.tasks[0].title, /Calentamiento breve/);
  assert.match(session.tasks[1].players, /dos grupos de 10/i);
  assert.match(session.tasks[1].players, /3 relevos/i);
  assert.match(session.tasks[2].players, /1 relevo rotatorio/i);
  assert.match(session.tasks[3].title, /7×7 \+ 2 porteros/);
  assert.match(session.tasks[3].players, /^20:/);
  assert.match(session.tasks[3].space, /Todo el campo chico disponible/);
  for (const task of session.tasks.slice(1)) {
    assert.match(task.notes + task.rotations, /finalizar|finalización|termina/i);
  }
  assert.match(session.methodology, /una pérdida o un robo no activan el cambio/i);
});

test('local session libraries fall back safely and preserve an edited session', () => {
  const fallback = normalizeSessionLibrary(null);
  assert.equal(fallback.version, 5);
  assert.equal(fallback.sessions.length, 5);
  assert.equal(fallback.activeId, ATAQUE_MC_23_SESSION_ID);

  const library = createDefaultSessionLibrary();
  library.sessions[0].title = 'Mi sesión editada';
  library.sessions[0].tasks[0].notes = 'Nota personal';
  const normalized = normalizeSessionLibrary(library);
  assert.equal(normalized.sessions[0].title, 'Mi sesión editada');
  assert.equal(normalized.sessions[0].tasks[0].notes, 'Nota personal');
  normalized.sessions[0].title = 'Otra';
  assert.equal(library.sessions[0].title, 'Mi sesión editada', 'normalization returns an independent copy');
});

test('the downloadable session includes all fields, nine diagrams and escaped coach text', () => {
  const session = createDefaultDaniaSession();
  session.generalNotes = '<script>alert("no")</script> & observación';
  const html = buildSessionExportHtml(session, () => '<svg viewBox="0 0 800 640"></svg>');
  assert.match(html, /Infantil Demo Albolote/);
  assert.match(html, /19:45/);
  assert.match(html, /Campo chico/);
  assert.match(html, /Eric Marín Soto y Tomás Álvarez Rico/);
  assert.match(html, /Reglas \/ condicionantes|Reglas/);
  assert.equal((html.match(/<svg /g) || []).length, 9);
  assert.doesNotMatch(html, /<script>alert/);
  assert.match(html, /&lt;script&gt;alert\(&quot;no&quot;\)&lt;\/script&gt; &amp; observación/);
  assert.equal(sessionDownloadName(session, 'html'), 'sesion-presion-tras-perdida-en-zona-2.html');
  assert.equal(sessionDownloadName(session, 'json'), 'sesion-presion-tras-perdida-en-zona-2.json');
});

test('the board mounts an accessible session planner with save and export actions', () => {
  const main = read('vendor/board/src/main.ts');
  const planner = read('vendor/board/src/dania-session-planner.ts');
  const css = read('vendor/board/src/dania-brand.css');
  assert.match(main, /id="dania-session-open">Sesiones<\/button>/);
  assert.match(main, /mountDaniaSessionPlanner\(/);
  assert.match(planner, /role="dialog" aria-modal="true"/);
  assert.match(planner, /data-session-action="save"/);
  assert.match(planner, /data-session-action="json"/);
  assert.match(planner, /data-session-action="html"/);
  assert.match(planner, /data-session-action="print"/);
  assert.match(planner, /Abrir y editar las 3 pizarras/);
  assert.match(planner, /localStorage\.setItem\(DANIA_SESSION_STORAGE_KEY/);
  assert.match(css, /\.dania-session-modal/);
  assert.match(css, /@media \(max-width: 580px\)/);
});

test('the new 90-minute session carries the 3-4-2-1 build-up plan and three keepers', () => {
  const session = createSalida3421Session();
  assert.equal(session.id, SALIDA_3421_SESSION_ID);
  assert.equal(session.team, 'Infantil Demo Albolote');
  assert.equal(session.durationMin, 90);
  assert.equal(session.participants, 20);
  assert.equal(session.goalkeepers, 3);
  for (const goalkeeper of ['Eric Marín Soto', 'Daniel Campos', 'Tomás Álvarez']) {
    assert.match(session.availableGoalkeepers, new RegExp(goalkeeper));
  }
  assert.equal(sessionTaskMinutes(session), 82);
  assert.deepEqual(session.tasks.map(task => task.diagram || null), [null, 'salida-base', 'salida-lado', 'salida-colectiva']);
  assert.match(session.tasks[0].title, /Pases en parejas y tríos/);
  assert.equal(session.tasks[0].durationMin, 8);
  assert.match(session.secondaryObjectives, /lateralizar/i);
  assert.match(session.secondaryObjectives, /mediapuntas/i);
  assert.match(session.tasks[2].coachingPoints, /Pivote fuera, mediapunta por dentro/i);
  assert.match(session.tasks[3].organization, /3-4-2-1/);
  const html = buildSessionExportHtml(session, () => '<svg viewBox="0 0 800 640"></svg>');
  assert.equal((html.match(/<svg /g) || []).length, 9);
  assert.match(html, /90 minutos planificados \(82 minutos de tareas\)/);
});

test('the current session is a 90-minute organized retreat plan for 21 players on the small field', () => {
  const session = createRepliegue21Session();
  assert.equal(session.id, REPLIEGUE_21_SESSION_ID);
  assert.equal(session.day, 'Miércoles');
  assert.equal(session.date, '09/09/2026');
  assert.equal(session.durationMin, 90);
  assert.equal(session.participants, 21);
  assert.equal(session.goalkeepers, 2);
  assert.match(session.availableGoalkeepers, /Eric Marín Soto/);
  assert.match(session.availableGoalkeepers, /Tomás Álvarez Rico/);
  assert.match(session.field, /Campo chico/);
  assert.match(session.field, /espacio muy reducido/i);
  assert.equal(session.coachCount, 1);
  assert.equal(sessionTaskMinutes(session), 81);
  assert.deepEqual(session.tasks.map(task => task.diagram || null), [null, 'repliegue-pasillos', 'repliegue-oleadas', 'repliegue-partido']);
  assert.deepEqual(session.tasks.map(task => task.durationMin), [8, 22, 24, 27]);
  assert.match(session.generalNotes, /VUELTA, DENTRO Y JUNTOS/);
  assert.match(session.tasks[1].players, /tres grupos de 7/i);
  assert.match(session.tasks[2].players, /tres equipos de 6/i);
  assert.match(session.tasks[3].players, /8 contra 8/);
  const html = buildSessionExportHtml(session, () => '<svg viewBox="0 0 800 640"></svg>');
  assert.equal((html.match(/<svg /g) || []).length, 9);
  assert.match(html, /90 minutos planificados \(81 minutos de tareas\)/);
});

test('the newest session trains the last pass with 22 players, three keepers and the full 3-4-2-1', () => {
  const session = createUltimoPase22Session();
  assert.equal(session.id, ULTIMO_PASE_22_SESSION_ID);
  assert.equal(session.day, 'Lunes');
  assert.equal(session.date, '14/09/2026');
  assert.equal(session.durationMin, 90);
  assert.equal(session.participants, 22);
  assert.equal(session.goalkeepers, 3);
  for (const goalkeeper of ['Eric Marín Soto', 'Daniel Campos', 'Tomás Álvarez']) {
    assert.match(session.availableGoalkeepers, new RegExp(goalkeeper));
  }
  assert.match(session.field, /Campo grande/);
  assert.equal(session.coachCount, 1);
  assert.equal(sessionTaskMinutes(session), 81);
  assert.deepEqual(session.tasks.map(task => task.diagram || null), [null, 'ultimo-pase-superioridad', 'ultimo-pase-oleadas', 'ultimo-pase-partido']);
  assert.deepEqual(session.tasks.map(task => task.durationMin), [8, 22, 24, 27]);
  assert.match(session.generalNotes, /MIRA, FIJA Y FILTRA/);
  assert.match(session.tasks[1].players, /dos grupos de 11/i);
  assert.match(session.tasks[2].players, /tres equipos de 6/i);
  assert.match(session.tasks[3].organization, /3-4-2-1 completo/i);
  for (const task of session.tasks.slice(1)) {
    for (const goalkeeper of ['Eric', 'Daniel', 'Tomás']) assert.match(task.rotations, new RegExp(goalkeeper));
    assert.match(task.notes + task.rotations, /finalizar|finaliza|termina|terminar/i);
  }
  const html = buildSessionExportHtml(session, () => '<svg viewBox="0 0 800 640"></svg>');
  assert.equal((html.match(/<svg /g) || []).length, 9);
  assert.match(html, /90 minutos planificados \(81 minutos de tareas\)/);
});

test('the active session trains organized attack through the MCs with 23 players on the small field', () => {
  const session = createAtaqueMc23Session();
  assert.equal(session.id, ATAQUE_MC_23_SESSION_ID);
  assert.equal(session.day, 'Miércoles');
  assert.equal(session.date, '16/09/2026');
  assert.equal(session.durationMin, 90);
  assert.equal(session.participants, 23);
  assert.equal(session.goalkeepers, 3);
  for (const goalkeeper of ['Eric Marín Soto', 'Daniel Campos', 'Tomás Álvarez']) {
    assert.match(session.availableGoalkeepers, new RegExp(goalkeeper));
  }
  assert.match(session.field, /Campo chico/);
  assert.match(session.field, /espacio muy reducido/i);
  assert.equal(session.coachCount, 1);
  assert.equal(sessionTaskMinutes(session), 80);
  assert.deepEqual(session.tasks.map(task => task.diagram || null), [null, 'ataque-mc-posesion', 'ataque-mc-progresion', 'ataque-mc-partido']);
  assert.deepEqual(session.tasks.map(task => task.durationMin), [8, 20, 24, 28]);
  assert.match(session.generalNotes, /MIRA, PERFÍLATE Y CAMBIA/);
  assert.match(session.tasks[1].players, /dos grupos de 10/i);
  assert.match(session.tasks[2].organization, /3\+2/);
  assert.match(session.tasks[3].organization, /3-4-2-1/);
  for (const task of session.tasks.slice(1)) {
    for (const goalkeeper of ['Eric', 'Daniel', 'Tomás']) assert.match(task.rotations, new RegExp(goalkeeper));
    assert.match(task.notes + task.rotations, /finalizar|finaliza|termina|terminar|final/i);
  }
  const html = buildSessionExportHtml(session, () => '<svg viewBox="0 0 800 640"></svg>');
  assert.equal((html.match(/<svg /g) || []).length, 9);
  assert.match(html, /90 minutos planificados \(80 minutos de tareas\)/);
});

test('older browser libraries receive each newer session once without losing edits', () => {
  const previous = createDefaultDaniaSession();
  previous.title = 'Mi sesión de zona 2 editada';
  const migrated = normalizeSessionLibrary({ version: 1, activeId: previous.id, sessions: [previous] });
  assert.equal(migrated.version, 5);
  assert.equal(migrated.activeId, ATAQUE_MC_23_SESSION_ID);
  assert.equal(migrated.sessions.length, 5);
  assert.equal(migrated.sessions[0].title, 'Mi sesión de zona 2 editada');
  assert.equal(migrated.sessions.filter(session => session.id === SALIDA_3421_SESSION_ID).length, 1);
  assert.equal(migrated.sessions.filter(session => session.id === REPLIEGUE_21_SESSION_ID).length, 1);
  assert.equal(migrated.sessions.filter(session => session.id === ULTIMO_PASE_22_SESSION_ID).length, 1);
  assert.equal(migrated.sessions.filter(session => session.id === ATAQUE_MC_23_SESSION_ID).length, 1);

  const normalizedAgain = normalizeSessionLibrary(migrated);
  assert.equal(normalizedAgain.sessions.filter(session => session.id === SALIDA_3421_SESSION_ID).length, 1);
  assert.equal(normalizedAgain.sessions.filter(session => session.id === REPLIEGUE_21_SESSION_ID).length, 1);
  assert.equal(normalizedAgain.sessions.filter(session => session.id === ULTIMO_PASE_22_SESSION_ID).length, 1);
  assert.equal(normalizedAgain.sessions.filter(session => session.id === ATAQUE_MC_23_SESSION_ID).length, 1);

  const versionTwo = normalizeSessionLibrary({
    version: 2,
    activeId: SALIDA_3421_SESSION_ID,
    sessions: [previous, createSalida3421Session()],
  });
  assert.equal(versionTwo.version, 5);
  assert.equal(versionTwo.activeId, ATAQUE_MC_23_SESSION_ID);
  assert.equal(versionTwo.sessions.length, 5);

  const versionThree = normalizeSessionLibrary({
    version: 3,
    activeId: REPLIEGUE_21_SESSION_ID,
    sessions: [previous, createSalida3421Session(), createRepliegue21Session()],
  });
  assert.equal(versionThree.version, 5);
  assert.equal(versionThree.activeId, ATAQUE_MC_23_SESSION_ID);
  assert.equal(versionThree.sessions.length, 5);
  assert.equal(versionThree.sessions.filter(session => session.id === ULTIMO_PASE_22_SESSION_ID).length, 1);

  const versionFour = normalizeSessionLibrary({
    version: 4,
    activeId: ULTIMO_PASE_22_SESSION_ID,
    sessions: [previous, createSalida3421Session(), createRepliegue21Session(), createUltimoPase22Session()],
  });
  assert.equal(versionFour.version, 5);
  assert.equal(versionFour.activeId, ATAQUE_MC_23_SESSION_ID);
  assert.equal(versionFour.sessions.length, 5);
  assert.equal(versionFour.sessions.filter(session => session.id === ATAQUE_MC_23_SESSION_ID).length, 1);
});
