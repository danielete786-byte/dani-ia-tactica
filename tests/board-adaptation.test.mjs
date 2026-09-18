import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import ts from 'typescript';
import { daniaPitches } from '../vendor/board/src/dania-pitches.ts';
import { isTextOptionField, updateOptionText } from '../vendor/board/src/option-fields.ts';
import { nextRealTimeFrame } from '../vendor/board/src/animation-timing.ts';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

// Frozen before localization, from the first integrated upstream checkpoint.
// Text and accessibility labels may change; action protocols must not.
const hookContracts = {
  'main.ts': '4c82eaa56f89d621308f54143d4770b16aed08da733a91d80b3ccb8db41167ea',
  'boards-view.ts': 'e3fb48c1ea72ffa5509e3be8367748a5b4e9e2565b0f066771cb735f52dacfe8',
  'teams.ts': '74ec3d66be3fce54fe8e831d921e40fb21aba96175deb694b71e751de724abe4',
  'saves.ts': 'a89e0c1035f493f1fda772cc749f2fef8233534d28689bdf91a1773d8c71bd1c',
  'importer.ts': 'd105d97b5e1a90768eea2d86e3f69ae04aa9b19a38983fcb364e67e70c3b2405',
  'composer.ts': 'fb33ef9250bf4757834f537cabe0d42967f2e284064f0cb0c7c0d8a82083ca63',
};

for (const [name, expected] of Object.entries(hookContracts)) {
  test(`${name}: localization preserves editor action hooks and valid syntax`, () => {
    const source = read(`vendor/board/src/${name}`);
    const hooks = [...source.matchAll(/\bdata-[a-z0-9-]+="[^"\n]*"/g)].map(m => m[0]).sort();
    assert.equal(createHash('sha256').update(hooks.join('\n')).digest('hex'), expected);
    const parsed = ts.createSourceFile(name, source, ts.ScriptTarget.Latest, true);
    assert.equal(parsed.parseDiagnostics.length, 0);
  });
}

test('the app evaluates the canvas only in a client effect and uses independent branding', () => {
  const client = read('app/board-client.tsx');
  assert.match(client, /^"use client"/);
  assert.match(client, /useEffect\(/);
  assert.match(client, /void import\("\.\.\/vendor\/board\/src\/main"\)/);
  assert.match(client, /data-startup-error/);
  assert.match(read('app/layout.tsx'), /DanIA Táctica/);
  assert.match(read('vite.config.ts'), /__BOARD_SELF_HOSTED__:\s*"true"/);
  assert.match(read('vendor/board/src/main.ts'), /if \(BOARD_SELF_HOSTED\) return \[/);
});

test('the original license is retained verbatim and attribution explains local storage', () => {
  assert.equal(read('public/LICENSE'), read('vendor/board/LICENSE'));
  assert.match(read('public/LICENSE'), /Copyright \(c\) 2026 Kyle Boas/);
  assert.equal(read('public/TRADEMARKS.md'), read('vendor/board/TRADEMARKS.md'));
  const main = read('vendor/board/src/main.ts');
  assert.match(main, /Board \(Tactics Journal\)/);
  assert.match(main, /no se sincronizan con otros dispositivos/);
  assert.match(main, /conserva por separado las imágenes originales/);
  assert.match(main, /Flechas, zonas y material/);
});

test('keyboard Home remains a browser key, not a translated team label', () => {
  assert.match(read('vendor/board/src/boards-view.ts'), /e\.key === 'Home'/);
  assert.doesNotMatch(read('vendor/board/src/boards-view.ts'), /e\.key === ["']Local["']/);
  assert.match(read('vendor/board/src/main.ts'), /e\.key\.startsWith\('Arrow'\)/);
  assert.doesNotMatch(read('vendor/board/src/main.ts'), /e\.key\.startsWith\(["']Flecha/);
});

test('the client graph has no unresolved identifiers that can abort startup', () => {
  const entry = new URL('../vendor/board/src/main.ts', import.meta.url).pathname;
  const program = ts.createProgram([entry], {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    skipLibCheck: true,
    allowImportingTsExtensions: true,
    noEmit: true,
    esModuleInterop: true,
    resolveJsonModule: true,
  });
  const errors = ts.getPreEmitDiagnostics(program).filter(d =>
    [2304, 2552].includes(d.code) && d.file?.fileName.includes('vendor/board/src/'));
  assert.deepEqual(errors.map(d => ts.flattenDiagnosticMessageText(d.messageText, '\n')), []);
  assert.doesNotMatch(read('vendor/board/src/main.ts'), /carryMenuEl/);
});

test('names and shirt numbers enter scene state on input, not only on blur', () => {
  const player = { type: 'player', name: '', label: '' };
  assert.equal(updateOptionText(player, 'name', 'Ana López'), true);
  assert.equal(updateOptionText(player, 'label', '8'), true);
  assert.equal(player.name, 'Ana López');
  assert.equal(player.label, '8');
  assert.equal(updateOptionText(player, 'mname', 'Wrong field'), false);
  assert.equal(player.name, 'Ana López');
  const marker = { type: 'marker', name: '' };
  assert.equal(updateOptionText(marker, 'mname', 'Apoyo'), true);
  const box = { type: 'box', label: '' };
  assert.equal(updateOptionText(box, 'box-label', 'Zona 1'), true);
  assert.equal(box.label, 'Zona 1');
  assert.equal(isTextOptionField('name'), true);
  assert.equal(isTextOptionField('hex'), false);
  assert.equal(isTextOptionField(undefined), false);
  const main = read('vendor/board/src/main.ts');
  assert.match(main, /optionsEl\.addEventListener\('input'/);
  assert.match(main, /if \(liveOptionInput\) return/);
});

test('resize handlers defer layout writes to avoid observer delivery loops', () => {
  for (const path of ['vendor/board/src/board.ts', 'vendor/board/src/sliding-pill.ts']) {
    assert.match(read(path), /new ResizeObserver\(\(\) => \{[\s\S]*?requestAnimationFrame/);
  }
  assert.match(read('vendor/board/src/sliding-pill.ts'), /cancelAnimationFrame\(sizeFrame\)/);
});

test('video timing holds fast frames and skips stale frames on slow devices', () => {
  assert.deepEqual(nextRealTimeFrame(0, 0, 25), { index: 1, waitMs: 40 });
  assert.deepEqual(nextRealTimeFrame(1, 45, 25), { index: 2, waitMs: 35 });
  assert.deepEqual(nextRealTimeFrame(1, 205, 25), { index: 6, waitMs: 35 });
  assert.deepEqual(nextRealTimeFrame(4, 200, 25), { index: 5, waitMs: 0 });
  assert.match(read('vendor/board/src/animate-export.ts'), /resolveBackground, true\)/);
});

test('all independent pitch images are self-contained with the original dimensions', () => {
  const heights = { pitch: 618, vertical: 640, training: 418, sidebyside: 533, classic: 418, session: 640 };
  for (const [name, uri] of Object.entries(daniaPitches)) {
    assert.ok(uri.startsWith('data:image/svg+xml;charset=utf-8,'));
    const svg = decodeURIComponent(uri.slice(uri.indexOf(',') + 1));
    assert.ok(svg.includes(`viewBox="0 0 800 ${heights[name]}"`));
    assert.match(svg, /DANIA TÁCTICA/);
    assert.doesNotMatch(svg, /tacticsjournal|<image|<script|foreignObject|NaN/);
    assert.ok(svg.endsWith('</svg>'));
  }
});
