import { emptyMatch, type ArrowObj, type BoxObj, type PlayerObj, type Scene, type SceneObj } from './types.ts'
import type { Board, Project } from './projects.ts'

export const ULTIMO_PASE_22_TASKS = [
  { key: 'ultimo-pase-superioridad', id: 'dania-ultimo-pase-superioridad-22-v1', title: 'Tarea 1 · Último pase 4×2 + P', detail: '22 jugadores · dos espacios y tres porteros activos' },
  { key: 'ultimo-pase-oleadas', id: 'dania-ultimo-pase-oleadas-22-v1', title: 'Tarea 2 · Oleadas 6+1×6', detail: '22 jugadores · tres equipos, comodín y rotación de porteros' },
  { key: 'ultimo-pase-partido', id: 'dania-ultimo-pase-partido-22-v1', title: 'Partido · 3-4-2-1 con delantero comodín', detail: '9×9 + 2P + delantero comodín · tercer portero rota' },
] as const

export type UltimoPase22TaskKey = typeof ULTIMO_PASE_22_TASKS[number]['key']
type Phase = 0 | 1 | 2
type Position = readonly [number, number]

const COLORS = {
  attack: '#d93636', defend: '#243e78', relay: '#f4cc4c', joker: '#b77710', keeper: '#8b949e',
  ink: '#26372d', soft: '#627266', field: '#e5eee2', line: '#789582', zone: '#e8be59',
}

const PHASES = ['Organización y fijación', 'Último pase', 'Finalización y relevo'] as const
const CUE = 'Consigna común: MIRA, FIJA Y FILTRA. El pase sale cuando empieza el desmarque, no cuando la carrera ya ha terminado.'
const RELAY_RULE = 'Los relevos entran únicamente cuando termina la acción por gol, remate fuera, balón fuera o señal del entrenador. Una pérdida o un robo no activan el cambio.'
const DIAGRAM_NOTE = 'Esquema orientativo y editable. Las tres pizarras mantienen las mismas identidades para reproducir los momentos de una misma acción.'

function label(id: string, x: number, y: number, text: string, size = 20, color = COLORS.ink): SceneObj {
  return { id, type: 'text', x, y, text, size, bold: true, color, rotation: 0 }
}

function rectangle(id: string, left: number, top: number, w: number, h: number, fill: string, opacity = 1, outline = false): BoxObj {
  return { id, type: 'box', shape: outline ? 'outline' : 'rect', x: left + w / 2, y: top + h / 2, w, h, fill, opacity, rotation: 0 }
}

function player(id: string, x: number, y: number, text: string, side: 'attack' | 'defend' | 'relay' | 'joker' | 'keeper'): PlayerObj {
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
    arrowLegend: { solid: 'Desmarque o remate', dashed: 'Pase', dotted: 'Rotación al finalizar' },
    objects,
  }
}

const TASK_ONE = {
  left: {
    attackers: [
      [[194, 458], [151, 360], [237, 360], [194, 258]],
      [[210, 430], [170, 320], [246, 340], [205, 242]],
      [[225, 410], [184, 286], [258, 315], [218, 205]],
    ] as readonly (readonly Position[])[],
    defenders: [
      [[168, 224], [220, 224]],
      [[176, 245], [235, 260]],
      [[180, 218], [245, 235]],
    ] as readonly (readonly Position[])[],
  },
  right: {
    attackers: [
      [[568, 458], [526, 360], [610, 360]],
      [[580, 430], [543, 320], [620, 340]],
      [[595, 410], [556, 286], [630, 315]],
    ] as readonly (readonly Position[])[],
    defenders: [
      [[544, 224], [596, 224]],
      [[550, 245], [608, 260]],
      [[555, 218], [620, 235]],
    ] as readonly (readonly Position[])[],
    supportKeeper: [[568, 458], [580, 430], [595, 410]] as readonly Position[],
  },
}

function taskOneScene(phase: Phase, taskId: string): Scene {
  const leftAttack = TASK_ONE.left.attackers[phase]
  const leftDefend = TASK_ONE.left.defenders[phase]
  const rightAttack = TASK_ONE.right.attackers[phase]
  const rightDefend = TASK_ONE.right.defenders[phase]
  const rightSupport = TASK_ONE.right.supportKeeper[phase]
  const objects: SceneObj[] = [
    label(`${taskId}-title`, 25, 25, 'ÚLTIMO PASE · 2 ESPACIOS', 24),
    label(`${taskId}-count`, 595, 29, '22 JUG. · 3P', 20),
    label(`${taskId}-phase`, 25, 62, `${phase + 1}/3 · ${PHASES[phase]}`, 20, COLORS.soft),
    rectangle(`${taskId}-left-grass`, 50, 135, 290, 360, COLORS.field),
    rectangle(`${taskId}-left-boundary`, 50, 135, 290, 360, COLORS.line, 1, true),
    rectangle(`${taskId}-left-zone`, 50, 135, 290, 120, COLORS.zone, .12),
    rectangle(`${taskId}-right-grass`, 425, 135, 290, 360, COLORS.field),
    rectangle(`${taskId}-right-boundary`, 425, 135, 290, 360, COLORS.line, 1, true),
    rectangle(`${taskId}-right-zone`, 425, 135, 290, 120, COLORS.zone, .12),
    { id: `${taskId}-goal-left`, type: 'goal', x: 195, y: 120, size: 82, variant: 'normal' },
    { id: `${taskId}-goal-right`, type: 'goal', x: 570, y: 120, size: 82, variant: 'normal' },
    player(`${taskId}-keeper-1`, 195, 162, 'P1', 'keeper'),
    player(`${taskId}-keeper-2`, 570, 162, 'P2', 'keeper'),
    player(`${taskId}-keeper-3`, rightSupport[0], rightSupport[1], 'P3', 'keeper'),
    ...leftAttack.map(([x, y], index) => player(`${taskId}-left-attack-${index + 1}`, x, y, ['PV', 'MP1', 'MP2', '9'][index], 'attack')),
    ...leftDefend.map(([x, y], index) => player(`${taskId}-left-defend-${index + 1}`, x, y, `D${index + 1}`, 'defend')),
    ...rightAttack.map(([x, y], index) => player(`${taskId}-right-attack-${index + 1}`, x, y, ['MP1', 'MP2', '9'][index], 'attack')),
    ...rightDefend.map(([x, y], index) => player(`${taskId}-right-defend-${index + 1}`, x, y, `D${index + 1}`, 'defend')),
    ...([92, 156, 220, 284] as const).map((x, index) => player(`${taskId}-left-relay-${index + 1}`, x, 550, `R${index + 1}`, 'relay')),
    ...([467, 531, 595, 659] as const).map((x, index) => player(`${taskId}-right-relay-${index + 1}`, x, 550, `R${index + 1}`, 'relay')),
    { id: `${taskId}-ball-left`, type: 'ball', x: phase === 0 ? 194 : phase === 1 ? 170 : 212, y: phase === 0 ? 432 : phase === 1 ? 300 : 220, size: 17 },
    { id: `${taskId}-ball-right`, type: 'ball', x: phase === 0 ? 568 : phase === 1 ? 543 : 595, y: phase === 0 ? 432 : phase === 1 ? 300 : 220, size: 17 },
    label(`${taskId}-left-label`, 55, 108, 'GRUPO A · 10 campo + P', 20, COLORS.soft),
    label(`${taskId}-right-label`, 430, 108, 'GRUPO B · 9 campo + 2P', 20, COLORS.soft),
    label(`${taskId}-relay-label`, 54, 590, 'Relevos: atacantes tras cada acción · defensores cada 2 acciones', 20, COLORS.soft),
  ]

  if (phase === 0) {
    objects.push(
      arrow(`${taskId}-left-first-pass`, leftAttack[0], leftAttack[1], COLORS.attack, 'dashed'),
      arrow(`${taskId}-right-first-pass`, rightSupport, rightAttack[0], COLORS.attack, 'dashed'),
      label(`${taskId}-spacing`, 248, 90, 'MP entre líneas · 9 fija', 20, COLORS.soft),
    )
  } else if (phase === 1) {
    objects.push(
      arrow(`${taskId}-left-final-pass`, leftAttack[1], leftAttack[3], COLORS.attack, 'dashed'),
      arrow(`${taskId}-left-far-run`, leftAttack[2], [235, 225], COLORS.attack),
      arrow(`${taskId}-right-final-pass`, rightAttack[0], rightAttack[2], COLORS.attack, 'dashed'),
      arrow(`${taskId}-right-far-run`, rightAttack[1], [625, 225], COLORS.attack),
      label(`${taskId}-timing`, 245, 90, 'Pase al inicio del desmarque', 20, COLORS.soft),
    )
  } else {
    objects.push(
      arrow(`${taskId}-left-shot`, leftAttack[3], [195, 170], COLORS.attack),
      arrow(`${taskId}-right-shot`, rightAttack[2], [570, 170], COLORS.attack),
      arrow(`${taskId}-left-relay-arrow`, [92, 535], [130, 475], COLORS.relay, 'dotted'),
      arrow(`${taskId}-right-relay-arrow`, [467, 535], [500, 475], COLORS.relay, 'dotted'),
      label(`${taskId}-finish`, 280, 90, '9 primer palo · MP segundo', 20, COLORS.soft),
    )
  }
  return scene(objects)
}

const WAVE = {
  attack: [
    [[165, 205], [165, 435], [245, 245], [245, 395], [330, 270], [330, 370]],
    [[245, 205], [245, 435], [325, 245], [325, 395], [415, 270], [415, 370]],
    [[330, 205], [330, 435], [410, 245], [410, 395], [500, 265], [500, 375]],
  ] as readonly (readonly Position[])[],
  defend: [
    [[430, 205], [430, 435], [500, 250], [500, 390], [565, 275], [565, 365]],
    [[455, 205], [455, 435], [515, 250], [515, 390], [570, 275], [570, 365]],
    [[515, 200], [515, 440], [555, 245], [555, 395], [595, 280], [595, 360]],
  ] as readonly (readonly Position[])[],
  joker: [[355, 320], [455, 320], [520, 320]] as readonly Position[],
}

function waveScene(phase: Phase, taskId: string): Scene {
  const attack = WAVE.attack[phase]
  const defend = WAVE.defend[phase]
  const joker = WAVE.joker[phase]
  const objects: SceneObj[] = [
    label(`${taskId}-title`, 25, 25, 'OLEADAS · ÚLTIMO PASE', 24),
    label(`${taskId}-count`, 595, 29, '22 JUG. · 3P', 20),
    label(`${taskId}-phase`, 25, 62, `${phase + 1}/3 · ${PHASES[phase]}`, 20, COLORS.soft),
    rectangle(`${taskId}-grass`, 70, 130, 610, 370, COLORS.field),
    rectangle(`${taskId}-boundary`, 70, 130, 610, 370, COLORS.line, 1, true),
    rectangle(`${taskId}-finish-zone`, 505, 130, 175, 370, COLORS.zone, .12),
    arrow(`${taskId}-halfway`, [375, 130], [375, 500], COLORS.line, 'dashed', false),
    { id: `${taskId}-goal-left`, type: 'goal', x: 55, y: 315, size: 84, variant: 'normal', rotation: 270 },
    { id: `${taskId}-goal-right`, type: 'goal', x: 695, y: 315, size: 84, variant: 'normal', rotation: 90 },
    player(`${taskId}-keeper-1`, 98, 315, 'P1', 'keeper'),
    player(`${taskId}-keeper-2`, 652, 315, 'P2', 'keeper'),
    player(`${taskId}-keeper-3`, 720, 555, 'P3', 'keeper'),
    ...attack.map(([x, y], index) => player(`${taskId}-attack-${index + 1}`, x, y, `A${index + 1}`, 'attack')),
    ...defend.map(([x, y], index) => player(`${taskId}-defend-${index + 1}`, x, y, `B${index + 1}`, 'defend')),
    player(`${taskId}-joker-1`, joker[0], joker[1], 'MP', 'joker'),
    ...([210, 280, 350, 420, 490, 560] as const).map((x, index) => player(`${taskId}-relay-${index + 1}`, x, 560, `C${index + 1}`, 'relay')),
    { id: `${taskId}-ball`, type: 'ball', x: phase === 0 ? 120 : phase === 1 ? 440 : 535, y: phase === 0 ? 315 : phase === 1 ? 320 : 320, size: 17 },
    label(`${taskId}-rotation`, 74, 530, 'A ataca B · B ataca C · C ataca A', 20, COLORS.soft),
  ]

  if (phase === 0) {
    objects.push(
      arrow(`${taskId}-start`, [112, 315], attack[0], COLORS.attack, 'dashed'),
      arrow(`${taskId}-find-joker`, attack[2], joker, COLORS.attack, 'dashed'),
      label(`${taskId}-shape`, 445, 108, '6 + MP contra 6', 20, COLORS.soft),
    )
  } else if (phase === 1) {
    objects.push(
      arrow(`${taskId}-final-pass`, joker, attack[5], COLORS.attack, 'dashed'),
      arrow(`${taskId}-nine-run`, attack[5], [550, 320], COLORS.attack),
      arrow(`${taskId}-far-run`, attack[4], [535, 245], COLORS.attack),
      label(`${taskId}-timing`, 405, 108, 'MP mira · 9 rompe', 20, COLORS.soft),
    )
  } else {
    objects.push(
      arrow(`${taskId}-shot`, attack[5], [645, 315], COLORS.attack),
      arrow(`${taskId}-relay-entry`, [350, 545], [400, 480], COLORS.relay, 'dotted'),
      label(`${taskId}-bonus`, 370, 108, 'Gol doble tras pase filtrado o pase atrás', 20, COLORS.soft),
    )
  }
  return scene(objects)
}

const MATCH = {
  attack: [
    [[170, 205], [170, 320], [170, 435], [280, 170], [280, 270], [280, 370], [280, 470], [405, 260], [405, 380]],
    [[245, 205], [230, 320], [245, 435], [350, 165], [330, 265], [330, 375], [350, 475], [455, 255], [455, 385]],
    [[330, 205], [310, 320], [330, 435], [440, 165], [410, 260], [410, 380], [440, 475], [525, 245], [525, 395]],
  ] as readonly (readonly Position[])[],
  defend: [
    [[555, 185], [555, 275], [555, 365], [555, 455], [475, 240], [475, 320], [475, 400], [425, 285], [425, 355]],
    [[585, 185], [585, 275], [585, 365], [585, 455], [505, 240], [505, 320], [505, 400], [465, 285], [465, 355]],
    [[605, 180], [605, 270], [605, 370], [605, 460], [545, 235], [545, 320], [545, 405], [500, 285], [500, 355]],
  ] as readonly (readonly Position[])[],
  joker: [[510, 320], [555, 320], [590, 320]] as readonly Position[],
}

function matchScene(phase: Phase, taskId: string): Scene {
  const attack = MATCH.attack[phase]
  const defend = MATCH.defend[phase]
  const joker = MATCH.joker[phase]
  const objects: SceneObj[] = [
    label(`${taskId}-title`, 25, 25, 'PARTIDO · 3-4-2-1', 24),
    label(`${taskId}-count`, 595, 29, '22 JUG. · 3P', 20),
    label(`${taskId}-phase`, 25, 62, `${phase + 1}/3 · ${phase === 0 ? '3-4-2 + 9 comodín' : phase === 1 ? 'MP recibe de cara' : 'Ocupación del área'}`, 20, COLORS.soft),
    rectangle(`${taskId}-grass`, 70, 130, 610, 380, COLORS.field),
    rectangle(`${taskId}-boundary`, 70, 130, 610, 380, COLORS.line, 1, true),
    rectangle(`${taskId}-finish-zone`, 500, 130, 180, 380, COLORS.zone, .10),
    arrow(`${taskId}-halfway`, [375, 130], [375, 510], COLORS.line, 'dashed', false),
    { id: `${taskId}-goal-left`, type: 'goal', x: 55, y: 320, size: 84, variant: 'normal', rotation: 270 },
    { id: `${taskId}-goal-right`, type: 'goal', x: 695, y: 320, size: 84, variant: 'normal', rotation: 90 },
    player(`${taskId}-keeper-1`, 98, 320, 'P1', 'keeper'),
    player(`${taskId}-keeper-2`, 652, 320, 'P2', 'keeper'),
    player(`${taskId}-keeper-3`, 735, 555, 'P3', 'keeper'),
    ...attack.map(([x, y], index) => player(`${taskId}-attack-${index + 1}`, x, y, ['C1', 'C2', 'C3', 'CAI', 'PV1', 'PV2', 'CAD', 'MP1', 'MP2'][index], 'attack')),
    ...defend.map(([x, y], index) => player(`${taskId}-defend-${index + 1}`, x, y, `B${index + 1}`, 'defend')),
    player(`${taskId}-joker-1`, joker[0], joker[1], '9', 'joker'),
    { id: `${taskId}-ball`, type: 'ball', x: phase === 0 ? 210 : phase === 1 ? 445 : 535, y: phase === 0 ? 320 : phase === 1 ? 260 : 250, size: 17 },
    label(`${taskId}-keeper-rotation`, 70, 555, 'Porteros cada 9 min: Eric/Tomás · Daniel/Eric · Tomás/Daniel', 20, COLORS.soft),
  ]

  if (phase === 0) {
    objects.push(
      arrow(`${taskId}-build`, attack[1], attack[4], COLORS.attack, 'dashed'),
      arrow(`${taskId}-between-lines`, attack[4], attack[7], COLORS.attack, 'dashed'),
      label(`${taskId}-shape`, 390, 108, 'Equipo con balón: 3-4-2-1 completo', 20, COLORS.soft),
    )
  } else if (phase === 1) {
    objects.push(
      arrow(`${taskId}-mp-pass`, attack[7], joker, COLORS.attack, 'dashed'),
      arrow(`${taskId}-nine-move`, joker, [605, 300], COLORS.attack),
      arrow(`${taskId}-far-mp`, attack[8], [570, 405], COLORS.attack),
      label(`${taskId}-trigger`, 410, 108, 'MP de cara = atacar portería', 20, COLORS.soft),
    )
  } else {
    objects.push(
      arrow(`${taskId}-last-pass`, attack[7], [600, 250], COLORS.attack, 'dashed'),
      arrow(`${taskId}-near-post`, joker, [630, 295], COLORS.attack),
      arrow(`${taskId}-second-post`, attack[8], [620, 390], COLORS.attack),
      arrow(`${taskId}-cutback`, attack[5], [555, 340], COLORS.attack),
      label(`${taskId}-occupy`, 320, 108, '9 primer palo · MP2 segundo · MP1 pase atrás', 20, COLORS.soft),
    )
  }
  return scene(objects)
}

function taskNotes(key: UltimoPase22TaskKey, phase: Phase): string {
  const mounting = key === 'ultimo-pase-superioridad'
    ? 'Dos espacios de 32×28 m, uno en cada portería. Grupo A: 10 jugadores de campo + 1 portero. Grupo B: 9 jugadores de campo + 2 porteros; uno defiende la portería y el otro inicia como pivote de apoyo con los pies.'
    : key === 'ultimo-pase-oleadas'
      ? 'Campo de 60×48 m con dos porterías. Diecinueve jugadores de campo: tres equipos de 6 y un mediapunta comodín. Juegan 6 + comodín contra 6; el tercer equipo espera. Dos porteros están en las porterías y el tercero queda de relevo activo con los balones.'
      : 'Campo de 70×55 m. Dos equipos de 9 se organizan en 3-4-2 y el delantero comodín juega siempre con el poseedor, que completa el 3-4-2-1. Dos porteros juegan y el tercero rota como relevo.'
  const detail = [
    'Conservar amplitud y alturas distintas. Los mediapuntas ocupan los intervalos y el delantero fija la última línea. El poseedor conduce o circula hasta atraer a un defensor.',
    'Cuando un mediapunta recibe perfilado y atrae, el delantero inicia la ruptura y el mediapunta alejado ataca el espacio libre. El pasador decide entre pase filtrado, pared o pase atrás.',
    'Finalizar ocupando zonas diferentes: delantero al primer palo o profundidad, mediapunta alejado al segundo palo y mediapunta cercano a la zona de pase atrás. El relevo entra después de que la acción termine.',
  ][phase]
  const rotation = key === 'ultimo-pase-superioridad'
    ? 'Tras cada acción sale el cuarteto atacante y entra el siguiente; los defensores cambian cada dos acciones. Porteros: 0-7 Eric/Tomás en meta y Daniel de apoyo; 7-14 Daniel/Eric en meta y Tomás de apoyo; 14-22 Tomás/Daniel en meta y Eric de apoyo.'
    : key === 'ultimo-pase-oleadas'
      ? 'Al finalizar, el equipo que defendía ataca al que esperaba: A contra B, B contra C y C contra A. El comodín cambia cada cuatro minutos con un jugador del equipo que está esperando. Porteros: 0-8 Eric/Tomás; 8-16 Daniel/Eric; 16-24 Tomás/Daniel.'
      : 'El delantero comodín cambia cada tres minutos, siempre al terminar una acción, con un mediapunta o delantero de uno de los equipos. Porteros: 0-9 Eric/Tomás; 9-18 Daniel/Eric; 18-27 Tomás/Daniel. Cada portero juega 18 minutos y descansa 9.'

  return `## ${PHASES[phase]}

Ataque organizado, último pase y finalización · Infantil Demo Albolote.

**Montaje:** ${mounting}

**Desarrollo:** ${detail}

**Relevos:** ${RELAY_RULE} ${rotation}

**Consigna:** ${CUE}

**Observar:** mediapuntas entre líneas, delantero fijando antes de romper, cabeza levantada, momento del pase y ocupación de primer palo, segundo palo y pase atrás.

${DIAGRAM_NOTE}`
}

export function createUltimoPase22Task(key: UltimoPase22TaskKey, now = Date.now()): Project {
  const task = ULTIMO_PASE_22_TASKS.find(item => item.key === key)
  if (!task) throw new Error('Tarea de último pase para 22 jugadores desconocida')
  const boards: Board[] = ([0, 1, 2] as const).map(phase => ({
    id: `${task.id}-phase-${phase + 1}`,
    title: `${phase + 1} · ${PHASES[phase]}`,
    view: { x: 0, y: 0, w: 800, h: 640 },
    scene: key === 'ultimo-pase-superioridad' ? taskOneScene(phase, task.id) : key === 'ultimo-pase-oleadas' ? waveScene(phase, task.id) : matchScene(phase, task.id),
    note: taskNotes(key, phase),
    link: { dur: 2200, ease: 'in-out' },
  }))
  return { id: task.id, name: `${task.title} · Último pase`, boards, updated: now }
}

export function resolveUltimoPase22Task(projects: readonly Project[], key: UltimoPase22TaskKey, now = Date.now()): { project: Project; created: boolean } {
  const task = ULTIMO_PASE_22_TASKS.find(item => item.key === key)
  if (!task) throw new Error('Tarea de último pase para 22 jugadores desconocida')
  const existing = projects.find(project => project.id === task.id)
  return existing ? { project: existing, created: false } : { project: createUltimoPase22Task(key, now), created: true }
}
