import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createAtaqueMc23Session, buildSessionExportHtml } from '../vendor/board/src/dania-session-planner.ts';
import { createDaniaTask } from '../vendor/board/src/dania-authored-tasks.ts';

const esc = value => String(value ?? '')
  .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');

const num = value => Number.isFinite(Number(value)) ? Number(value) : 0;

function renderScene(scene) {
  const parts = [
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 640" preserveAspectRatio="xMidYMid meet">',
    '<defs><marker id="arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 Z" fill="context-stroke"/></marker></defs>',
    '<rect width="800" height="640" fill="#ffffff"/>',
  ];
  for (const object of scene.objects ?? []) {
    if (object.type === 'box') {
      const x = num(object.x) - num(object.w) / 2;
      const y = num(object.y) - num(object.h) / 2;
      const transform = object.rotation ? ` transform="rotate(${num(object.rotation)} ${num(object.x)} ${num(object.y)})"` : '';
      if (object.shape === 'outline') {
        parts.push(`<rect x="${x}" y="${y}" width="${num(object.w)}" height="${num(object.h)}" fill="none" stroke="${esc(object.fill)}" stroke-width="2" opacity="${num(object.opacity) || 1}"${transform}/>`);
      } else {
        parts.push(`<rect x="${x}" y="${y}" width="${num(object.w)}" height="${num(object.h)}" fill="${esc(object.fill)}" opacity="${num(object.opacity) || 1}"${transform}/>`);
      }
    } else if (object.type === 'arrow') {
      const dash = object.dash === 'dotted' ? '2 8' : object.dash === 'dashed' ? '10 7' : '';
      parts.push(`<line x1="${num(object.x1)}" y1="${num(object.y1)}" x2="${num(object.x2)}" y2="${num(object.y2)}" stroke="${esc(object.color)}" stroke-width="${num(object.width) || 3}"${dash ? ` stroke-dasharray="${dash}"` : ''}${object.head ? ' marker-end="url(#arrow)"' : ''}/>`);
    } else if (object.type === 'player') {
      const x = num(object.x), y = num(object.y), r = Math.max(num(object.r), 14);
      parts.push(`<circle cx="${x}" cy="${y}" r="${r}" fill="${esc(object.color)}" stroke="#ffffff" stroke-width="3"/>`);
      parts.push(`<text x="${x}" y="${y + 4.5}" text-anchor="middle" font-family="DejaVu Sans,Arial,sans-serif" font-size="${Math.max(10, r * .76)}" font-weight="700" fill="#ffffff">${esc(object.label)}</text>`);
    } else if (object.type === 'ball') {
      const x = num(object.x), y = num(object.y), r = Math.max(5, num(object.size) / 2);
      parts.push(`<circle cx="${x}" cy="${y}" r="${r}" fill="#ffffff" stroke="#222" stroke-width="2"/><circle cx="${x}" cy="${y}" r="2.5" fill="#222"/>`);
    } else if (object.type === 'goal') {
      const x = num(object.x), y = num(object.y), size = num(object.size);
      parts.push(`<g transform="rotate(${num(object.rotation)} ${x} ${y})"><rect x="${x - size / 2}" y="${y - 8}" width="${size}" height="16" fill="none" stroke="#27352d" stroke-width="3"/><path d="M ${x - size / 2} ${y - 8} L ${x - size / 2 + 8} ${y + 8} M ${x + size / 2} ${y - 8} L ${x + size / 2 - 8} ${y + 8}" stroke="#789582" stroke-width="1.5"/></g>`);
    } else if (object.type === 'text') {
      const size = Math.max(12, num(object.size));
      const transform = object.rotation ? ` transform="rotate(${num(object.rotation)} ${num(object.x)} ${num(object.y)})"` : '';
      parts.push(`<text x="${num(object.x)}" y="${num(object.y) + size * .8}" font-family="DejaVu Sans,Arial,sans-serif" font-size="${size}" font-weight="${object.bold ? 700 : 400}" fill="${esc(object.color)}"${transform}>${esc(object.text)}</text>`);
    }
  }
  parts.push('</svg>');
  return parts.join('');
}

const output = resolve(process.argv[2] || 'tmp/pdfs/ataque-mc-23');
mkdirSync(output, { recursive: true });

const session = createAtaqueMc23Session();
writeFileSync(resolve(output, 'session.json'), JSON.stringify(session, null, 2));
writeFileSync(resolve(output, 'session.html'), buildSessionExportHtml(session, renderScene));

for (const task of session.tasks) {
  if (!task.diagram) continue;
  const project = createDaniaTask(task.diagram, 0);
  project.boards.forEach((board, index) => {
    writeFileSync(resolve(output, `${task.diagram}-${index + 1}.svg`), renderScene(board.scene));
    writeFileSync(resolve(output, `${task.diagram}-${index + 1}.json`), JSON.stringify(board.scene, null, 2));
  });
}

console.log(output);
