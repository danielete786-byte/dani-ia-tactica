import { emptyMatch, type ArrowObj, type BoxObj, type PlayerObj, type Scene, type SceneObj } from './types.ts'
import type { Board, Project } from './projects.ts'

export const SALIDA_3421_TASKS = [
  { key: 'salida-base', id: 'dania-s3421-salida-base-20-v1', title: 'Tarea 1 · Salida con 3 centrales + doble pivote', detail: '20 jugadores · 6×3 + 1 relevo en cada campo' },
  { key: 'salida-lado', id: 'dania-s3421-salida-lado-20-v1', title: 'Tarea 2 · Pivote lateral + mediapunta', detail: '20 jugadores · Dos lados trabajados a la vez' },
  { key: 'salida-colectiva', id: 'dania-s3421-colectiva-20-v1', title: 'Colectiva · Salida completa 3-4-2-1', detail: '20 jugadores · 10×7 + 3 porteros' },
] as const

export type Salida3421TaskKey = typeof SALIDA_3421_TASKS[number]['key']
type Phase = 0 | 1 | 2
type Position = readonly [number, number]

const COLORS = {
  team: '#d93636', rival: '#243e78', relay: '#f4cc4c', keeper: '#9ca3af',
  ink: '#26372d', soft: '#627266', field: '#e5eee2', line: '#789582', zone: '#e8be59',
}

const PHASES = ['Estructura inicial', 'Movimientos de apoyo', 'Progresión'] as const
const RELAY_RULE = 'El relevo entra únicamente cuando termina la jugada por salida completada, gol, disparo fuera o balón fuera. Una pérdida o un robo no detienen la acción.'
const GENERAL_RULE = 'Tres centrales abiertos. Los dos pivotes se lateralizan y quedan escalonados. Los dos mediapuntas bajan por dentro, siempre un escalón por delante de los pivotes. Carrileros altos y abiertos; delantero fijando y dando profundidad.'
const DIAGRAM_NOTE = 'Esquema orientativo y editable. Las tres pizarras representan momentos de la misma acción y mantienen las mismas identidades para poder reproducir la secuencia.'

function label(id: string, x: number, y: number, text: string, size = 20, color = COLORS.ink): SceneObj {
  return { id, type: 'text', x, y, text, size, bold: true, color, rotation: 0 }
}

function rectangle(id: string, left: number, top: number, w: number, h: number, fill: string, opacity = 1, outline = false): BoxObj {
  return { id, type: 'box', shape: outline ? 'outline' : 'rect', x: left + w / 2, y: top + h / 2, w, h, fill, opacity, rotation: 0 }
}

function player(id: string, x: number, y: number, text: string, side: 'team' | 'rival' | 'relay' | 'keeper'): PlayerObj {
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
    arrowLegend: { solid: 'Desplazamiento', dashed: 'Pase', dotted: 'Segunda opción' },
    objects,
  }
}

const BASE_TEAM_POSITIONS: readonly { players: readonly Position[]; rivals: readonly Position[]; ball: Position }[] = [
  { players: [[105, 415], [165, 395], [225, 415], [145, 330], [185, 330]], rivals: [[125, 245], [165, 270], [205, 245]], ball: [165, 470] },
  { players: [[105, 415], [165, 395], [225, 415], [80, 325], [250, 305]], rivals: [[125, 265], [165, 290], [205, 265]], ball: [165, 395] },
  { players: [[105, 415], [165, 395], [225, 415], [80, 325], [250, 305]], rivals: [[105, 285], [165, 300], [225, 275]], ball: [80, 325] },
]

function baseField(field: 0 | 1, phase: Phase, taskId: string): SceneObj[] {
  const dx = field * 390
  const left = 30 + dx
  const center = 165 + dx
  const id = `${taskId}-field-${field + 1}`
  const positions = BASE_TEAM_POSITIONS[phase]
  const mirrorX = (x: number) => field === 0 ? x + dx : left + 270 - (x - 30)
  const mapPosition = ([x, y]: Position): Position => [mirrorX(x), y]
  const team = positions.players.map(mapPosition)
  const rivals = positions.rivals.map(mapPosition)
  const ball = mapPosition(positions.ball)
  const objects: SceneObj[] = [
    rectangle(`${id}-grass`, left, 145, 270, 370, COLORS.field),
    rectangle(`${id}-boundary`, left, 145, 270, 370, COLORS.line, 1, true),
    rectangle(`${id}-build-zone`, left + 1, 338, 268, 176, COLORS.zone, .12),
    arrow(`${id}-build-line`, [left, 338], [left + 270, 338], COLORS.line, 'dashed', false),
    label(`${id}-heading`, left, 106, `CAMPO ${field + 1} · 6×3 + 1R`, 20),
    label(`${id}-roles`, left + 4, 124, '3 centrales + 2 pivotes + portero', 20, COLORS.soft),
    { id: `${id}-goal`, type: 'goal', x: center, y: 515, size: 72, variant: 'normal', rotation: 180 },
    { id: `${id}-exit-left`, type: 'goal', x: left + 82, y: 145, size: 44, variant: 'small' },
    { id: `${id}-exit-right`, type: 'goal', x: left + 188, y: 145, size: 44, variant: 'small' },
    player(`${id}-keeper-${field + 1}`, center, 474, `P${field + 1}`, 'keeper'),
    ...team.map(([x, y], index) => player(`${id}-team-${index + 1}`, x, y, ['CI', 'CC', 'CD', 'PV1', 'PV2'][index], 'team')),
    ...rivals.map(([x, y], index) => player(`${id}-rival-${index + 1}`, x, y, `B${index + 1}`, 'rival')),
    { id: `${id}-ball`, type: 'ball', x: ball[0], y: ball[1], size: 17 },
    label(`${id}-relay-label`, left + 2, 545, 'RELEVO · entra al finalizar', 20, COLORS.soft),
    field === 0
      ? player(`${id}-keeper-3-relay`, center, 578, 'P3', 'keeper')
      : player(`${id}-relay-1`, center, 578, 'R1', 'relay'),
  ]

  if (phase === 0) {
    objects.push(
      arrow(`${id}-pass-cb`, [center, 458], mapPosition([165, 408]), COLORS.team, 'dashed'),
      arrow(`${id}-open-left`, mapPosition([140, 350]), mapPosition([92, 327]), COLORS.zone),
      arrow(`${id}-open-right`, mapPosition([190, 350]), mapPosition([238, 310]), COLORS.zone),
    )
  } else if (phase === 1) {
    objects.push(
      arrow(`${id}-pass-side`, mapPosition([165, 392]), mapPosition([105, 415]), COLORS.team, 'dashed'),
      arrow(`${id}-pivot-left`, mapPosition([145, 330]), mapPosition([80, 325]), COLORS.zone),
      arrow(`${id}-pivot-right`, mapPosition([185, 330]), mapPosition([250, 305]), COLORS.zone),
    )
  } else {
    objects.push(
      arrow(`${id}-pass-pivot`, mapPosition([105, 405]), mapPosition([80, 325]), COLORS.team, 'dashed'),
      arrow(`${id}-exit`, mapPosition([80, 310]), mapPosition([112, 169]), COLORS.team, 'dashed'),
      arrow(`${id}-switch`, mapPosition([80, 325]), mapPosition([250, 305]), COLORS.team, 'dotted'),
    )
  }
  return objects
}

function baseScene(phase: Phase, taskId: string): Scene {
  return scene([
    label(`${taskId}-title`, 25, 25, 'SALIDA BASE · 3C + 2PV', 24),
    label(`${taskId}-count`, 650, 29, '20 JUG. · 3P', 20),
    label(`${taskId}-phase`, 25, 62, `${phase + 1}/3 · ${PHASES[phase]}`, 20, COLORS.soft),
    ...baseField(0, phase, taskId),
    ...baseField(1, phase, taskId),
    label(`${taskId}-legend`, 28, 612, 'Rojo: salida · Azul: presión · Gris: portero · Amarillo: relevo', 20, COLORS.soft),
  ])
}

type SideRolePositions = { team: readonly Position[]; rivals: readonly Position[]; ball: Position }

const SIDE_POSITIONS: readonly SideRolePositions[] = [
  { team: [[130, 410], [200, 430], [185, 342], [82, 270], [212, 245]], rivals: [[125, 275], [180, 285], [230, 320]], ball: [165, 470] },
  { team: [[130, 410], [200, 430], [102, 345], [72, 255], [205, 310]], rivals: [[135, 290], [175, 255], [235, 335]], ball: [130, 410] },
  { team: [[130, 410], [200, 430], [102, 345], [72, 235], [205, 300]], rivals: [[130, 310], [170, 265], [240, 335]], ball: [205, 300] },
]

function sideField(field: 0 | 1, phase: Phase, taskId: string): SceneObj[] {
  const dx = field * 390
  const left = 30 + dx
  const center = 165 + dx
  const id = `${taskId}-field-${field + 1}`
  const mirrorX = (x: number) => field === 0 ? x + dx : left + 270 - (x - 30)
  const mapPosition = ([x, y]: Position): Position => [mirrorX(x), y]
  const positions = SIDE_POSITIONS[phase]
  const roles = field === 0 ? ['CI', 'CC', 'PVI', 'CAI', 'MPI'] : ['CD', 'CC', 'PVD', 'CAD', 'MPD']
  const objects: SceneObj[] = [
    rectangle(`${id}-grass`, left, 145, 270, 370, COLORS.field),
    rectangle(`${id}-boundary`, left, 145, 270, 370, COLORS.line, 1, true),
    rectangle(`${id}-inside-lane`, left + 82, 145, 110, 370, COLORS.zone, .12),
    arrow(`${id}-lane-left`, [left + 82, 145], [left + 82, 515], COLORS.line, 'dashed', false),
    arrow(`${id}-lane-right`, [left + 192, 145], [left + 192, 515], COLORS.line, 'dashed', false),
    label(`${id}-heading`, left, 106, field === 0 ? 'LADO IZQUIERDO · 6×3 + 1R' : 'LADO DERECHO · 6×3 + 1R', 20),
    { id: `${id}-goal`, type: 'goal', x: center, y: 515, size: 72, variant: 'normal', rotation: 180 },
    { id: `${id}-exit`, type: 'goal', x: field === 0 ? left + 72 : left + 198, y: 145, size: 48, variant: 'small' },
    player(`${id}-keeper-${field + 1}`, center, 474, `P${field + 1}`, 'keeper'),
    ...positions.team.map((position, index) => {
      const [x, y] = mapPosition(position)
      return player(`${id}-team-${index + 1}`, x, y, roles[index], 'team')
    }),
    ...positions.rivals.map((position, index) => {
      const [x, y] = mapPosition(position)
      return player(`${id}-rival-${index + 1}`, x, y, `B${index + 1}`, 'rival')
    }),
    { id: `${id}-ball`, type: 'ball', x: mapPosition(positions.ball)[0], y: positions.ball[1], size: 17 },
    label(`${id}-relay-label`, left + 2, 545, 'RELEVO · entra al finalizar', 20, COLORS.soft),
    field === 0
      ? player(`${id}-keeper-3-relay`, center, 578, 'P3', 'keeper')
      : player(`${id}-relay-1`, center, 578, 'R1', 'relay'),
  ]

  if (phase === 0) {
    objects.push(
      arrow(`${id}-first-pass`, [center, 458], mapPosition([200, 430]), COLORS.team, 'dashed'),
      arrow(`${id}-pivot-reference`, mapPosition([185, 360]), mapPosition([145, 345]), COLORS.zone),
    )
  } else if (phase === 1) {
    objects.push(
      arrow(`${id}-pivot-move`, mapPosition([185, 342]), mapPosition([102, 345]), COLORS.zone),
      arrow(`${id}-ten-move`, mapPosition([212, 245]), mapPosition([205, 310]), COLORS.zone),
      arrow(`${id}-pass-pivot`, mapPosition([130, 410]), mapPosition([102, 345]), COLORS.team, 'dashed'),
    )
  } else {
    objects.push(
      arrow(`${id}-pass-ten`, mapPosition([102, 345]), mapPosition([205, 300]), COLORS.team, 'dashed'),
      arrow(`${id}-third-man`, mapPosition([205, 300]), mapPosition([72, 235]), COLORS.team, 'dashed'),
      arrow(`${id}-turn`, mapPosition([205, 286]), mapPosition([field === 0 ? 102 : 228, 170]), COLORS.team, 'dotted'),
    )
  }
  return objects
}

function sideScene(phase: Phase, taskId: string): Scene {
  return scene([
    label(`${taskId}-title`, 25, 25, 'PIVOTE + MEDIAPUNTA · DOS LADOS', 24),
    label(`${taskId}-count`, 650, 29, '20 JUG. · 3P', 20),
    label(`${taskId}-phase`, 25, 62, `${phase + 1}/3 · ${PHASES[phase]}`, 20, COLORS.soft),
    ...sideField(0, phase, taskId),
    ...sideField(1, phase, taskId),
    label(`${taskId}-legend`, 28, 612, 'PV: pivote · MP: mediapunta · CA: carrilero · Rojo: salida · Azul: presión', 20, COLORS.soft),
  ])
}

const COLLECTIVE_TEAM: readonly { players: readonly Position[]; rivals: readonly Position[]; ball: Position }[] = [
  {
    players: [[220, 448], [365, 468], [510, 448], [130, 330], [310, 372], [420, 372], [600, 330], [310, 255], [420, 255], [365, 175]],
    rivals: [[310, 410], [420, 410], [235, 305], [365, 325], [495, 305], [300, 205], [430, 205]],
    ball: [365, 514],
  },
  {
    players: [[210, 438], [365, 462], [520, 438], [125, 315], [245, 365], [485, 350], [605, 315], [305, 292], [425, 292], [365, 170]],
    rivals: [[285, 397], [445, 397], [220, 310], [365, 340], [510, 305], [300, 205], [430, 205]],
    ball: [365, 462],
  },
  {
    players: [[205, 430], [355, 454], [515, 430], [118, 300], [238, 350], [480, 345], [612, 300], [300, 280], [420, 275], [365, 165]],
    rivals: [[255, 390], [450, 390], [205, 315], [360, 330], [510, 300], [295, 205], [435, 205]],
    ball: [300, 280],
  },
]

function collectiveScene(phase: Phase, taskId: string): Scene {
  const positions = COLLECTIVE_TEAM[phase]
  const roles = ['CI', 'CC', 'CD', 'CAI', 'PVI', 'PVD', 'CAD', 'MPI', 'MPD', 'DC']
  const objects: SceneObj[] = [
    label(`${taskId}-title`, 25, 25, 'COLECTIVA · 3-4-2-1', 24),
    label(`${taskId}-count`, 650, 29, '20 JUG. · 3P', 20),
    label(`${taskId}-phase`, 25, 62, `${phase + 1}/3 · ${PHASES[phase]}`, 20, COLORS.soft),
    rectangle(`${taskId}-grass`, 72, 104, 585, 448, COLORS.field),
    rectangle(`${taskId}-boundary`, 72, 104, 585, 448, COLORS.line, 1, true),
    rectangle(`${taskId}-middle-zone`, 72, 245, 585, 180, COLORS.zone, .10),
    arrow(`${taskId}-third-one`, [72, 245], [657, 245], COLORS.line, 'dashed', false),
    arrow(`${taskId}-third-two`, [72, 425], [657, 425], COLORS.line, 'dashed', false),
    { id: `${taskId}-goal-top`, type: 'goal', x: 365, y: 104, size: 86, variant: 'normal' },
    { id: `${taskId}-goal-bottom`, type: 'goal', x: 365, y: 552, size: 86, variant: 'normal', rotation: 180 },
    player(`${taskId}-keeper-1`, 365, 515, 'P1', 'keeper'),
    player(`${taskId}-keeper-2`, 365, 137, 'P2', 'keeper'),
    player(`${taskId}-keeper-3-relay`, 730, 330, 'P3', 'keeper'),
    label(`${taskId}-relay-label`, 685, 286, 'RELEVO', 20, COLORS.soft),
    ...positions.players.map(([x, y], index) => player(`${taskId}-team-${index + 1}`, x, y, roles[index], 'team')),
    ...positions.rivals.map(([x, y], index) => player(`${taskId}-rival-${index + 1}`, x, y, `B${index + 1}`, 'rival')),
    { id: `${taskId}-ball`, type: 'ball', x: positions.ball[0], y: positions.ball[1], size: 17 },
    label(`${taskId}-team-label`, 84, 575, 'Rojo: 3-4-2-1 · Azul: 2-3-2', 20, COLORS.soft),
    label(`${taskId}-rotation`, 430, 575, 'Porteros: salida → rival → relevo', 20, COLORS.soft),
  ]

  if (phase === 0) {
    objects.push(
      arrow(`${taskId}-start-pass`, [365, 498], [365, 475], COLORS.team, 'dashed'),
      arrow(`${taskId}-left-cb`, [330, 460], [220, 448], COLORS.team, 'dotted'),
      arrow(`${taskId}-right-cb`, [400, 460], [510, 448], COLORS.team, 'dotted'),
    )
  } else if (phase === 1) {
    objects.push(
      arrow(`${taskId}-pivot-left`, [310, 372], [245, 365], COLORS.zone),
      arrow(`${taskId}-pivot-right`, [420, 372], [485, 350], COLORS.zone),
      arrow(`${taskId}-ten-left`, [310, 255], [305, 292], COLORS.zone),
      arrow(`${taskId}-ten-right`, [420, 255], [425, 292], COLORS.zone),
      arrow(`${taskId}-cb-pass`, [365, 448], [245, 365], COLORS.team, 'dashed'),
    )
  } else {
    objects.push(
      arrow(`${taskId}-pivot-ten`, [238, 350], [300, 280], COLORS.team, 'dashed'),
      arrow(`${taskId}-ten-wing`, [300, 280], [118, 300], COLORS.team, 'dashed'),
      arrow(`${taskId}-ten-striker`, [300, 280], [365, 165], COLORS.team, 'dotted'),
      arrow(`${taskId}-switch-side`, [238, 350], [480, 345], COLORS.team, 'dotted'),
    )
  }
  return scene(objects)
}

function taskNotes(key: Salida3421TaskKey, phase: Phase): string {
  const taskDescription = key === 'salida-base'
    ? 'Dos campos contiguos. En cada uno: portero + 3 centrales + 2 pivotes contra 3 defensores + 1 relevo. El equipo de salida progresa por una de las dos puertas; si el rival roba, ataca la portería.'
    : key === 'salida-lado'
      ? 'Dos campos reflejados. En cada uno: portero, central del medio, central exterior, pivote, carrilero y mediapunta contra 3 defensores + 1 relevo. Un campo representa el lado izquierdo y el otro el derecho.'
      : 'Equipo rojo completo en 3-4-2-1 con portero contra 7 jugadores y portero organizados en 2-3-2. El tercer portero rota como relevo. Todas las acciones comienzan desde el portero del equipo rojo.'
  const phaseDetail = [
    'Colocar las posiciones de referencia y comenzar con una circulación reconocible. Dar tiempo al poseedor para levantar la cabeza y observar qué línea está libre.',
    'Cuando el portero o el central controlan, los pivotes se lateralizan. Los mediapuntas bajan por dentro sin ponerse en la misma línea que los pivotes. Los carrileros mantienen amplitud y altura.',
    'Si el pivote recibe de cara, juega hacia el mediapunta o cambia de lado. Si el mediapunta recibe de espaldas, descarga; si puede girarse, progresa. El delantero mantiene profundidad y fija.',
  ][phase]
  return `## ${PHASES[phase]}

Salida de balón en 3-4-2-1 · Infantil Demo Albolote.

**Montaje:** ${taskDescription}

**Desarrollo:** ${phaseDetail}

**Relevos y porteros:** ${RELAY_RULE} Los porteros rotan por los tres roles: portería de salida, portería rival o apoyo/relevo con los pies.

**Consigna:** ${GENERAL_RULE}

**Observar:** perfil corporal, distancia entre líneas, momento del movimiento y capacidad para jugar hacia delante sin forzar un pase marcado.

${DIAGRAM_NOTE}`
}

export function createSalida3421Task(key: Salida3421TaskKey, now = Date.now()): Project {
  const task = SALIDA_3421_TASKS.find(item => item.key === key)
  if (!task) throw new Error('Tarea de salida 3-4-2-1 desconocida')
  const boards: Board[] = ([0, 1, 2] as const).map(phase => ({
    id: `${task.id}-phase-${phase + 1}`,
    title: `${phase + 1} · ${PHASES[phase]}`,
    view: { x: 0, y: 0, w: 800, h: 640 },
    scene: key === 'salida-base' ? baseScene(phase, task.id) : key === 'salida-lado' ? sideScene(phase, task.id) : collectiveScene(phase, task.id),
    note: taskNotes(key, phase),
    link: { dur: 2200, ease: 'in-out' },
  }))
  return { id: task.id, name: `${task.title} · Salida 3-4-2-1`, boards, updated: now }
}

export function resolveSalida3421Task(projects: readonly Project[], key: Salida3421TaskKey, now = Date.now()): { project: Project; created: boolean } {
  const task = SALIDA_3421_TASKS.find(item => item.key === key)
  if (!task) throw new Error('Tarea de salida 3-4-2-1 desconocida')
  const existing = projects.find(project => project.id === task.id)
  return existing ? { project: existing, created: false } : { project: createSalida3421Task(key, now), created: true }
}
