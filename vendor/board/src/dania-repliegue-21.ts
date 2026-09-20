import { emptyMatch, type ArrowObj, type BoxObj, type PlayerObj, type Scene, type SceneObj } from './types.ts'
import type { Board, Project } from './projects.ts'

export const REPLIEGUE_21_TASKS = [
  { key: 'repliegue-pasillos', id: 'dania-repliegue-pasillos-21-v1', title: 'Tarea 1 · Repliegue en 3 pasillos', detail: '21 jugadores · 3×3 + 1 relevo por pasillo' },
  { key: 'repliegue-oleadas', id: 'dania-repliegue-oleadas-21-v1', title: 'Tarea 2 · Oleadas 6+1×6', detail: '21 jugadores · 3 equipos y 2 porteros' },
  { key: 'repliegue-partido', id: 'dania-repliegue-partido-21-v1', title: 'Partido condicionado · 8×8 + 2P', detail: 'Campo chico · 3 relevos al finalizar' },
] as const

export type Repliegue21TaskKey = typeof REPLIEGUE_21_TASKS[number]['key']
type Phase = 0 | 1 | 2
type Position = readonly [number, number]

const COLORS = {
  attack: '#d93636', defend: '#243e78', relay: '#f4cc4c', keeper: '#9ca3af',
  ink: '#26372d', soft: '#627266', field: '#e5eee2', line: '#789582', zone: '#e8be59',
}

const PHASES = ['Organización inicial', 'Presión superada', 'Repliegue organizado'] as const
const CUE = 'Presión superada: VUELTA, DENTRO Y JUNTOS. El más cercano temporiza; los demás corren hacia su portería, protegen el centro y recuperan la estructura.'
const RELAY_RULE = 'Los relevos entran únicamente al terminar la acción por gol, finalización, balón fuera o señal del entrenador. Un pase que supera la presión, una pérdida o un robo no activan el cambio.'
const DIAGRAM_NOTE = 'Esquema orientativo y editable. Las tres pizarras representan momentos de la misma jugada y mantienen las mismas identidades para reproducir la secuencia.'

function label(id: string, x: number, y: number, text: string, size = 20, color = COLORS.ink): SceneObj {
  return { id, type: 'text', x, y, text, size, bold: true, color, rotation: 0 }
}

function rectangle(id: string, left: number, top: number, w: number, h: number, fill: string, opacity = 1, outline = false): BoxObj {
  return { id, type: 'box', shape: outline ? 'outline' : 'rect', x: left + w / 2, y: top + h / 2, w, h, fill, opacity, rotation: 0 }
}

function player(id: string, x: number, y: number, text: string, side: 'attack' | 'defend' | 'relay' | 'keeper'): PlayerObj {
  return { id, type: 'player', x, y, r: 14, color: COLORS[side], label: text, name: '', namePos: 'bottom', nameSize: 18, nameDisplay: 'full' }
}

function arrow(id: string, from: Position, to: Position, color: string, dash: ArrowObj['dash'] = 'solid', head = true): ArrowObj {
  return { id, type: 'arrow', x1: from[0], y1: from[1], x2: to[0], y2: to[1], mx: (from[0] + to[0]) / 2, my: (from[1] + to[1]) / 2, color, dash, width: head ? 3 : 1.5, curved: false, head, headSize: 9 }
}

function scene(objects: SceneObj[]): Scene {
  return {
    version: 4,
    pitch: 'dania-session',
    board: { w: 800, h: 640 },
    match: emptyMatch(),
    arrowLegend: { solid: 'Presión o temporización', dashed: 'Pase rival', dotted: 'Repliegue' },
    objects,
  }
}

type LanePositions = { attack: readonly Position[]; defend: readonly Position[]; ball: Position }
const LANE_POSITIONS: readonly LanePositions[] = [
  { attack: [[110, 470], [68, 414], [152, 414]], defend: [[110, 345], [72, 370], [148, 370]], ball: [110, 448] },
  { attack: [[110, 410], [70, 350], [150, 350]], defend: [[110, 328], [76, 300], [144, 300]], ball: [110, 365] },
  { attack: [[112, 286], [70, 248], [154, 245]], defend: [[118, 262], [78, 205], [146, 205]], ball: [136, 278] },
]

function laneObjects(lane: 0 | 1 | 2, phase: Phase, taskId: string): SceneObj[] {
  const left = 30 + lane * 260
  const dx = left - 30
  const id = `${taskId}-lane-${lane + 1}`
  const positions = LANE_POSITIONS[phase]
  const map = ([x, y]: Position): Position => [x + dx, y]
  const attack = positions.attack.map(map)
  const defend = positions.defend.map(map)
  const ball = map(positions.ball)
  const objects: SceneObj[] = [
    rectangle(`${id}-grass`, left, 145, 220, 360, COLORS.field),
    rectangle(`${id}-boundary`, left, 145, 220, 360, COLORS.line, 1, true),
    rectangle(`${id}-protect-zone`, left, 145, 220, 116, COLORS.zone, .14),
    arrow(`${id}-midline`, [left, 325], [left + 220, 325], COLORS.line, 'dashed', false),
    label(`${id}-heading`, left + 4, 112, `PASILLO ${lane + 1} · 3×3 + 1R`, 20),
    { id: `${id}-gate-left`, type: 'goal', x: left + 68, y: 145, size: 42, variant: 'small' },
    { id: `${id}-gate-right`, type: 'goal', x: left + 152, y: 145, size: 42, variant: 'small' },
    ...attack.map(([x, y], index) => lane < 2 && index === 0
      ? player(`${id}-keeper-${lane + 1}`, x, y, `P${lane + 1}`, 'keeper')
      : player(`${id}-attack-${index + 1}`, x, y, `A${index + 1}`, 'attack')),
    ...defend.map(([x, y], index) => player(`${id}-defend-${index + 1}`, x, y, `B${index + 1}`, 'defend')),
    { id: `${id}-ball`, type: 'ball', x: ball[0], y: ball[1], size: 17 },
    label(`${id}-relay-label`, left + 5, 530, 'RELEVO · al finalizar', 20, COLORS.soft),
    player(`${id}-relay-1`, left + 110, 568, 'R', 'relay'),
  ]

  if (phase === 0) {
    objects.push(
      arrow(`${id}-first-pass`, map([110, 450]), map([68, 414]), COLORS.attack, 'dashed'),
      arrow(`${id}-press-1`, map([110, 345]), map([95, 390]), COLORS.defend),
      arrow(`${id}-press-2`, map([72, 370]), map([68, 400]), COLORS.defend),
    )
  } else if (phase === 1) {
    objects.push(
      arrow(`${id}-escape-pass`, map([92, 350]), map([128, 292]), COLORS.attack, 'dashed'),
      arrow(`${id}-delay`, map([110, 328]), map([126, 298]), COLORS.defend),
      label(`${id}-trigger`, left + 8, 487, 'TRIGGER: rival de cara', 20, COLORS.soft),
    )
  } else {
    const before = LANE_POSITIONS[1].defend.map(map)
    defend.forEach((to, index) => objects.push(arrow(`${id}-retreat-${index + 1}`, before[index], to, COLORS.defend, 'dotted')))
    objects.push(
      arrow(`${id}-next-pass`, map([136, 278]), map([78, 180]), COLORS.attack, 'dashed'),
      label(`${id}-compact`, left + 8, 487, '1 frena · 2 cierran', 20, COLORS.soft),
    )
  }
  return objects
}

function laneScene(phase: Phase, taskId: string): Scene {
  return scene([
    label(`${taskId}-title`, 25, 25, 'REPLIEGUE · 3 PASILLOS', 24),
    label(`${taskId}-count`, 610, 29, '21 JUG. · 2P', 20),
    label(`${taskId}-phase`, 25, 62, `${phase + 1}/3 · ${PHASES[phase]}`, 20, COLORS.soft),
    ...laneObjects(0, phase, taskId),
    ...laneObjects(1, phase, taskId),
    ...laneObjects(2, phase, taskId),
    label(`${taskId}-legend`, 30, 612, 'Rojo: ataque · Azul: defensa · Gris: portero · Amarillo: relevo', 20, COLORS.soft),
  ])
}

type WavePositions = { attack: readonly Position[]; defend: readonly Position[]; joker: Position; ball: Position }
const WAVE_POSITIONS: readonly WavePositions[] = [
  {
    attack: [[155, 205], [150, 330], [155, 450], [235, 240], [235, 420], [270, 330]],
    defend: [[300, 205], [295, 330], [300, 450], [365, 245], [365, 415], [395, 330]],
    joker: [235, 330], ball: [116, 330],
  },
  {
    attack: [[245, 205], [250, 330], [245, 450], [330, 240], [330, 420], [375, 330]],
    defend: [[365, 205], [370, 330], [365, 450], [420, 245], [420, 415], [445, 330]],
    joker: [330, 300], ball: [395, 330],
  },
  {
    attack: [[350, 205], [370, 330], [350, 450], [420, 245], [420, 415], [445, 330]],
    defend: [[590, 210], [600, 330], [590, 450], [510, 250], [510, 410], [475, 330]],
    joker: [395, 285], ball: [448, 330],
  },
]

function waveScene(phase: Phase, taskId: string): Scene {
  const positions = WAVE_POSITIONS[phase]
  const objects: SceneObj[] = [
    label(`${taskId}-title`, 25, 25, 'OLEADAS · 6+1×6', 24),
    label(`${taskId}-count`, 610, 29, '21 JUG. · 2P', 20),
    label(`${taskId}-phase`, 25, 62, `${phase + 1}/3 · ${PHASES[phase]}`, 20, COLORS.soft),
    rectangle(`${taskId}-grass`, 70, 130, 610, 370, COLORS.field),
    rectangle(`${taskId}-boundary`, 70, 130, 610, 370, COLORS.line, 1, true),
    rectangle(`${taskId}-recovery-zone`, 480, 130, 200, 370, COLORS.zone, .13),
    arrow(`${taskId}-halfway`, [375, 130], [375, 500], COLORS.line, 'dashed', false),
    { id: `${taskId}-goal-left`, type: 'goal', x: 55, y: 315, size: 84, variant: 'normal', rotation: 270 },
    { id: `${taskId}-goal-right`, type: 'goal', x: 695, y: 315, size: 84, variant: 'normal', rotation: 90 },
    player(`${taskId}-keeper-1`, 98, 315, 'P1', 'keeper'),
    player(`${taskId}-keeper-2`, 652, 315, 'P2', 'keeper'),
    ...positions.attack.map(([x, y], index) => player(`${taskId}-attack-${index + 1}`, x, y, `A${index + 1}`, 'attack')),
    ...positions.defend.map(([x, y], index) => player(`${taskId}-defend-${index + 1}`, x, y, `B${index + 1}`, 'defend')),
    player(`${taskId}-joker-1`, positions.joker[0], positions.joker[1], 'J', 'relay'),
    { id: `${taskId}-ball`, type: 'ball', x: positions.ball[0], y: positions.ball[1], size: 17 },
    label(`${taskId}-relay-label`, 72, 525, 'EQUIPO C · entra al terminar la oleada', 20, COLORS.soft),
    ...([215, 280, 345, 410, 475, 540] as const).map((x, index) => player(`${taskId}-relay-${index + 1}`, x, 570, `C${index + 1}`, 'relay')),
  ]

  if (phase === 0) {
    objects.push(
      arrow(`${taskId}-start-pass`, [112, 315], [150, 330], COLORS.attack, 'dashed'),
      arrow(`${taskId}-press-near`, [295, 330], [270, 330], COLORS.defend),
      label(`${taskId}-rotation`, 470, 110, 'A ataca · B defiende · C espera', 20, COLORS.soft),
    )
  } else if (phase === 1) {
    objects.push(
      arrow(`${taskId}-break-pass`, [340, 330], [395, 330], COLORS.attack, 'dashed'),
      arrow(`${taskId}-delay`, [445, 330], [425, 330], COLORS.defend),
      label(`${taskId}-trigger`, 470, 110, 'TRIGGER: rival de cara', 20, COLORS.soft),
    )
  } else {
    const before = WAVE_POSITIONS[1].defend
    positions.defend.forEach((to, index) => objects.push(arrow(`${taskId}-retreat-${index + 1}`, before[index], to, COLORS.defend, 'dotted')))
    objects.push(
      arrow(`${taskId}-attack-continuation`, [448, 330], [555, 300], COLORS.attack, 'dashed'),
      label(`${taskId}-block`, 470, 110, 'PROTEGER DENTRO PRIMERO', 20, COLORS.soft),
    )
  }
  return scene(objects)
}

type MatchPositions = { attack: readonly Position[]; defend: readonly Position[]; ball: Position }
const MATCH_POSITIONS: readonly MatchPositions[] = [
  {
    attack: [[140, 210], [140, 420], [205, 265], [205, 365], [275, 190], [275, 450], [325, 270], [325, 370]],
    defend: [[180, 205], [180, 320], [180, 435], [245, 245], [245, 395], [315, 210], [315, 430], [350, 320]],
    ball: [115, 320],
  },
  {
    attack: [[225, 205], [225, 435], [300, 250], [300, 390], [365, 190], [365, 455], [405, 275], [405, 370]],
    defend: [[300, 205], [300, 320], [300, 435], [365, 245], [365, 395], [420, 210], [420, 430], [450, 320]],
    ball: [420, 350],
  },
  {
    attack: [[330, 200], [330, 440], [385, 250], [385, 390], [430, 185], [430, 455], [455, 270], [455, 390]],
    defend: [[585, 195], [600, 275], [600, 365], [585, 445], [510, 235], [500, 330], [510, 425], [470, 330]],
    ball: [445, 350],
  },
]

function matchScene(phase: Phase, taskId: string): Scene {
  const positions = MATCH_POSITIONS[phase]
  const objects: SceneObj[] = [
    label(`${taskId}-title`, 25, 25, 'PARTIDO · 8×8 + 2P', 24),
    label(`${taskId}-count`, 610, 29, '21 JUG. · 3R', 20),
    label(`${taskId}-phase`, 25, 62, `${phase + 1}/3 · ${phase === 0 ? 'Presión alta' : phase === 1 ? 'Presión superada' : 'Bloque 4-3-1'}`, 20, COLORS.soft),
    rectangle(`${taskId}-grass`, 70, 130, 610, 380, COLORS.field),
    rectangle(`${taskId}-boundary`, 70, 130, 610, 380, COLORS.line, 1, true),
    rectangle(`${taskId}-inside-zone`, 445, 130, 235, 380, COLORS.zone, .10),
    arrow(`${taskId}-halfway`, [375, 130], [375, 510], COLORS.line, 'dashed', false),
    { id: `${taskId}-goal-left`, type: 'goal', x: 55, y: 320, size: 84, variant: 'normal', rotation: 270 },
    { id: `${taskId}-goal-right`, type: 'goal', x: 695, y: 320, size: 84, variant: 'normal', rotation: 90 },
    player(`${taskId}-keeper-1`, 98, 320, 'P1', 'keeper'),
    player(`${taskId}-keeper-2`, 652, 320, 'P2', 'keeper'),
    ...positions.attack.map(([x, y], index) => player(`${taskId}-attack-${index + 1}`, x, y, `A${index + 1}`, 'attack')),
    ...positions.defend.map(([x, y], index) => player(`${taskId}-defend-${index + 1}`, x, y, `B${index + 1}`, 'defend')),
    { id: `${taskId}-ball`, type: 'ball', x: positions.ball[0], y: positions.ball[1], size: 17 },
    label(`${taskId}-relay-label`, 706, 178, 'RELEVOS', 20, COLORS.soft),
    player(`${taskId}-relay-1`, 740, 245, 'R1', 'relay'),
    player(`${taskId}-relay-2`, 740, 325, 'R2', 'relay'),
    player(`${taskId}-relay-3`, 740, 405, 'R3', 'relay'),
    label(`${taskId}-direction`, 72, 542, 'Azul inicia desde P1 · Rojo presiona y protege la portería de P2', 20, COLORS.soft),
  ]

  if (phase === 0) {
    objects.push(
      arrow(`${taskId}-build-pass`, [112, 320], [140, 300], COLORS.defend, 'dashed'),
      arrow(`${taskId}-press-1`, [180, 320], [155, 320], COLORS.attack),
      arrow(`${taskId}-press-2`, [245, 245], [215, 265], COLORS.attack),
    )
  } else if (phase === 1) {
    objects.push(
      arrow(`${taskId}-break-pass`, [365, 390], [420, 350], COLORS.defend, 'dashed'),
      arrow(`${taskId}-delay`, [450, 320], [430, 338], COLORS.attack),
      label(`${taskId}-call`, 72, 108, '¡VUELTA! PRESIÓN SUPERADA', 20, COLORS.soft),
    )
  } else {
    const before = MATCH_POSITIONS[1].defend
    positions.defend.forEach((to, index) => objects.push(arrow(`${taskId}-retreat-${index + 1}`, before[index], to, COLORS.attack, 'dotted')))
    objects.push(
      arrow(`${taskId}-continue`, [445, 350], [525, 300], COLORS.defend, 'dashed'),
      label(`${taskId}-shape`, 72, 108, 'ROJO · BLOQUE 4-3-1', 20, COLORS.soft),
    )
  }
  return scene(objects)
}

function taskNotes(key: Repliegue21TaskKey, phase: Phase): string {
  const mounting = key === 'repliegue-pasillos'
    ? 'Tres pasillos contiguos de referencia 9×20 m. En cada uno: 3 atacantes contra 3 defensores + 1 relevo = 7. En los dos primeros pasillos, Eric y Tomás participan con los pies dentro del trío atacante. Total: 21.'
    : key === 'repliegue-oleadas'
      ? 'Dos porteros fijos y 19 jugadores de campo: tres equipos de 6, un comodín ofensivo y un equipo esperando. Juegan 6 + comodín contra 6; A ataca a B, B ataca a C y C ataca a A.'
      : 'Partido reducido 8 contra 8 + Eric y Tomás en portería + 3 relevos = 21. Estructura orientativa 3-3-1-1; al replegar, recuperar un 4-3-1 compacto.'
  const detail = [
    'Iniciar cada acción con el equipo atacante en posesión y el defensor presionando arriba. El objetivo ofensivo es progresar con control; el defensivo, reconocer si todavía puede presionar o si debe abandonar la persecución.',
    'Cuando un rival recibe orientado hacia delante o un pase elimina la primera línea, gritar “¡vuelta!”. El jugador más cercano temporiza sin lanzarse; todos los demás corren hacia su portería y hacia dentro.',
    'El equipo defensor protege primero el carril central, recupera distancias cortas y después ajusta al poseedor. Nadie queda caminando por delante del balón. La acción continúa hasta terminar.',
  ][phase]
  const rotation = key === 'repliegue-pasillos'
    ? 'El relevo de cada pasillo entra al finalizar y sustituye a un jugador del rol acordado. Rotar ataque, defensa y porteros con los pies entre bloques.'
    : key === 'repliegue-oleadas'
      ? 'Al finalizar, el equipo que defendía pasa a atacar al equipo que esperaba; el atacante sale. Rotación A contra B, B contra C y C contra A. Cambiar el comodín cada cuatro acciones.'
      : 'Los tres relevos entran únicamente en los parones, siguiendo una cola fija y alternando equipos para mantener el 8 contra 8.'

  return `## ${PHASES[phase]}

Defensa organizada y repliegue colectivo · Infantil Demo Albolote.

**Montaje:** ${mounting}

**Desarrollo:** ${detail}

**Relevos:** ${RELAY_RULE} ${rotation}

**Consigna:** ${CUE}

**Observar:** primera carrera hacia portería y hacia dentro, temporización del más cercano, comunicación, distancias cortas y sacrificio de los jugadores alejados.

${DIAGRAM_NOTE}`
}

export function createRepliegue21Task(key: Repliegue21TaskKey, now = Date.now()): Project {
  const task = REPLIEGUE_21_TASKS.find(item => item.key === key)
  if (!task) throw new Error('Tarea de repliegue para 21 jugadores desconocida')
  const boards: Board[] = ([0, 1, 2] as const).map(phase => ({
    id: `${task.id}-phase-${phase + 1}`,
    title: `${phase + 1} · ${key === 'repliegue-partido' && phase === 2 ? 'Bloque 4-3-1' : PHASES[phase]}`,
    view: { x: 0, y: 0, w: 800, h: 640 },
    scene: key === 'repliegue-pasillos' ? laneScene(phase, task.id) : key === 'repliegue-oleadas' ? waveScene(phase, task.id) : matchScene(phase, task.id),
    note: taskNotes(key, phase),
    link: { dur: 2200, ease: 'in-out' },
  }))
  return { id: task.id, name: `${task.title} · Repliegue`, boards, updated: now }
}

export function resolveRepliegue21Task(projects: readonly Project[], key: Repliegue21TaskKey, now = Date.now()): { project: Project; created: boolean } {
  const task = REPLIEGUE_21_TASKS.find(item => item.key === key)
  if (!task) throw new Error('Tarea de repliegue para 21 jugadores desconocida')
  const existing = projects.find(project => project.id === task.id)
  return existing ? { project: existing, created: false } : { project: createRepliegue21Task(key, now), created: true }
}
