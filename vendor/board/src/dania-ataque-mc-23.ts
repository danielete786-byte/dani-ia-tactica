import { emptyMatch, type ArrowObj, type BoxObj, type PlayerObj, type Scene, type SceneObj } from './types.ts'
import type { Board, Project } from './projects.ts'

export const ATAQUE_MC_23_TASKS = [
  { key: 'ataque-mc-posesion', id: 'dania-ataque-mc-posesion-23-v1', title: 'Tarea 1 · 4×4 + 2 MC + P', detail: '23 jugadores · dos espacios, doble pivote y tres porteros activos' },
  { key: 'ataque-mc-progresion', id: 'dania-ataque-mc-progresion-23-v1', title: 'Tarea 2 · 5×5 + P y dos salidas', detail: '23 jugadores · ataque organizado, cambio de orientación y finalización' },
  { key: 'ataque-mc-partido', id: 'dania-ataque-mc-partido-23-v1', title: 'Partido · 8×8 + 2 MC comodines', detail: '3-4-2-1 en posesión · dos relevos de campo y un portero' },
] as const

export type AtaqueMc23TaskKey = typeof ATAQUE_MC_23_TASKS[number]['key']
type Phase = 0 | 1 | 2
type Position = readonly [number, number]

const COLORS = {
  attack: '#d93636', defend: '#243e78', relay: '#f4cc4c', joker: '#b77710', keeper: '#8b949e',
  ink: '#26372d', soft: '#627266', field: '#e5eee2', line: '#789582', zone: '#e8be59',
}

const PHASES = ['Organizar y ofrecer apoyos', 'Circular por los MC', 'Cambiar el juego y progresar'] as const
const CUE = 'Consigna común: MIRA, PERFÍLATE Y CAMBIA. Un MC se acerca y el otro se coloca en diagonal, lejos de la presión.'
const RELAY_RULE = 'Los cambios se realizan únicamente al terminar la acción por gol, salida completada, disparo fuera o balón fuera.'
const DIAGRAM_NOTE = 'Esquema orientativo y editable. Las tres pizarras representan momentos consecutivos de la misma tarea.'

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
    arrowLegend: { solid: 'Desmarque o progresión', dashed: 'Pase', dotted: 'Rotación al finalizar' },
    objects,
  }
}

const GRID_LEFT: readonly Position[] = [[98, 235], [98, 395], [235, 205], [235, 425], [158, 285], [180, 350], [270, 270], [270, 360], [185, 250], [185, 390]]
const GRID_RIGHT: readonly Position[] = GRID_LEFT.map(([x, y]) => [x + 370, y] as const)

function possessionScene(phase: Phase, taskId: string): Scene {
  const shift = phase * 16
  const left = GRID_LEFT.map(([x, y], index) => [x + (index % 2 ? shift : 0), y] as const)
  const right = GRID_RIGHT.map(([x, y], index) => [x + (index % 2 ? -shift : 0), y] as const)
  const objects: SceneObj[] = [
    label(`${taskId}-title`, 25, 25, 'POSESIÓN · DOBLE PIVOTE', 24),
    label(`${taskId}-count`, 600, 29, '23 JUG. · 3P', 20),
    label(`${taskId}-phase`, 25, 62, `${phase + 1}/3 · ${PHASES[phase]}`, 20, COLORS.soft),
    rectangle(`${taskId}-left-grass`, 45, 135, 330, 365, COLORS.field),
    rectangle(`${taskId}-left-boundary`, 45, 135, 330, 365, COLORS.line, 1, true),
    rectangle(`${taskId}-left-middle`, 155, 135, 110, 365, COLORS.zone, .10),
    rectangle(`${taskId}-right-grass`, 425, 135, 330, 365, COLORS.field),
    rectangle(`${taskId}-right-boundary`, 425, 135, 330, 365, COLORS.line, 1, true),
    rectangle(`${taskId}-right-middle`, 535, 135, 110, 365, COLORS.zone, .10),
    player(`${taskId}-keeper-1`, 60, 318, 'P1', 'keeper'),
    player(`${taskId}-keeper-2`, 740, 318, 'P2', 'keeper'),
    player(`${taskId}-keeper-3`, 715, 555, 'P3', 'keeper'),
    ...left.slice(0, 4).map(([x, y], index) => player(`${taskId}-la-${index}`, x, y, `A${index + 1}`, 'attack')),
    ...left.slice(4, 8).map(([x, y], index) => player(`${taskId}-lb-${index}`, x, y, `B${index + 1}`, 'defend')),
    ...left.slice(8, 10).map(([x, y], index) => player(`${taskId}-lmc-${index}`, x, y, `MC${index + 1}`, 'joker')),
    ...right.slice(0, 4).map(([x, y], index) => player(`${taskId}-ra-${index}`, x, y, `A${index + 1}`, 'attack')),
    ...right.slice(4, 8).map(([x, y], index) => player(`${taskId}-rb-${index}`, x, y, `B${index + 1}`, 'defend')),
    ...right.slice(8, 10).map(([x, y], index) => player(`${taskId}-rmc-${index}`, x, y, `MC${index + 1}`, 'joker')),
    { id: `${taskId}-ball-left`, type: 'ball', x: phase === 0 ? 76 : phase === 1 ? 178 : 270, y: phase === 0 ? 318 : phase === 1 ? 250 : 205, size: 17 },
    { id: `${taskId}-ball-right`, type: 'ball', x: phase === 0 ? 724 : phase === 1 ? 558 : 535, y: phase === 0 ? 318 : phase === 1 ? 390 : 250, size: 17 },
    label(`${taskId}-rotation`, 46, 542, 'MC cambian cada 4 min · tercer portero introduce y rota cada 7 min', 20, COLORS.soft),
  ]
  if (phase === 0) {
    objects.push(
      arrow(`${taskId}-l-start`, [72, 318], left[0], COLORS.attack, 'dashed'),
      arrow(`${taskId}-l-support`, left[0], left[8], COLORS.attack, 'dashed'),
      arrow(`${taskId}-r-start`, [728, 318], right[0], COLORS.attack, 'dashed'),
      arrow(`${taskId}-r-support`, right[0], right[9], COLORS.attack, 'dashed'),
      label(`${taskId}-shape`, 280, 105, 'MC a distinta altura y en diagonal', 20, COLORS.soft),
    )
  } else if (phase === 1) {
    objects.push(
      arrow(`${taskId}-l-mc1`, left[0], left[8], COLORS.attack, 'dashed'),
      arrow(`${taskId}-l-mc2`, left[8], left[9], COLORS.attack, 'dashed'),
      arrow(`${taskId}-r-mc1`, right[0], right[9], COLORS.attack, 'dashed'),
      arrow(`${taskId}-r-mc2`, right[9], right[8], COLORS.attack, 'dashed'),
      label(`${taskId}-scan`, 300, 105, 'Mirar antes · jugar a dos toques', 20, COLORS.soft),
    )
  } else {
    objects.push(
      arrow(`${taskId}-l-switch`, left[9], left[3], COLORS.attack, 'dashed'),
      arrow(`${taskId}-r-switch`, right[8], right[3], COLORS.attack, 'dashed'),
      arrow(`${taskId}-keeper-rotation-arrow`, [700, 545], [665, 490], COLORS.relay, 'dotted'),
      label(`${taskId}-switch-label`, 275, 105, 'Cerrar un lado = cambiar al lado libre', 20, COLORS.soft),
    )
  }
  return scene(objects)
}

function progressionGroup(taskId: string, prefix: string, offset: number, phase: Phase): SceneObj[] {
  const attackBase: readonly Position[] = [[82, 250], [82, 390], [150, 320], [220, 265], [220, 375]]
  const defendBase: readonly Position[] = [[170, 205], [170, 435], [255, 230], [255, 410], [285, 320]]
  const attack = attackBase.map(([x, y]) => [x + offset + phase * 16, y] as const)
  const defend = defendBase.map(([x, y]) => [x + offset + phase * 6, y] as const)
  const startX = offset === 0 ? 52 : 748
  const mirror = offset === 0 ? 1 : -1
  const goalX = offset === 0 ? 35 : 765
  const gateX = offset === 0 ? 333 : 467
  const objs: SceneObj[] = [
    rectangle(`${taskId}-${prefix}-grass`, offset === 0 ? 45 : 425, 135, 330, 365, COLORS.field),
    rectangle(`${taskId}-${prefix}-boundary`, offset === 0 ? 45 : 425, 135, 330, 365, COLORS.line, 1, true),
    { id: `${taskId}-${prefix}-goal`, type: 'goal', x: goalX, y: 318, size: 76, variant: 'normal', rotation: offset === 0 ? 270 : 90 },
    player(`${taskId}-${prefix}-keeper`, startX, 318, offset === 0 ? 'P1' : 'P2', 'keeper'),
    ...attack.map(([x, y], index) => player(`${taskId}-${prefix}-a-${index}`, x, y, ['C1', 'C2', 'C3', 'MC1', 'MC2'][index], 'attack')),
    ...defend.map(([x, y], index) => player(`${taskId}-${prefix}-b-${index}`, x, y, `B${index + 1}`, 'defend')),
    rectangle(`${taskId}-${prefix}-gate-1`, gateX - 10, 190, 20, 70, COLORS.zone, .18, true),
    rectangle(`${taskId}-${prefix}-gate-2`, gateX - 10, 380, 20, 70, COLORS.zone, .18, true),
    { id: `${taskId}-${prefix}-ball`, type: 'ball', x: phase === 0 ? startX + 18 * mirror : phase === 1 ? attack[3][0] : gateX - 20 * mirror, y: phase === 2 ? 225 : 318, size: 17 },
  ]
  if (phase === 0) {
    objs.push(arrow(`${taskId}-${prefix}-start`, [startX + 14 * mirror, 318], attack[2], COLORS.attack, 'dashed'))
  } else if (phase === 1) {
    objs.push(
      arrow(`${taskId}-${prefix}-mc1`, attack[2], attack[3], COLORS.attack, 'dashed'),
      arrow(`${taskId}-${prefix}-mc2`, attack[3], attack[4], COLORS.attack, 'dashed'),
    )
  } else {
    objs.push(
      arrow(`${taskId}-${prefix}-exit`, attack[4], [gateX - 10 * mirror, 225], COLORS.attack, 'dashed'),
      arrow(`${taskId}-${prefix}-support`, attack[3], [gateX - 55 * mirror, 405], COLORS.attack),
    )
  }
  return objs
}

function progressionScene(phase: Phase, taskId: string): Scene {
  const objects: SceneObj[] = [
    label(`${taskId}-title`, 25, 25, 'ATAQUE ORGANIZADO · 5×5 + P', 24),
    label(`${taskId}-count`, 600, 29, '23 JUG. · 3P', 20),
    label(`${taskId}-phase`, 25, 62, `${phase + 1}/3 · ${PHASES[phase]}`, 20, COLORS.soft),
    ...progressionGroup(taskId, 'left', 0, phase),
    ...progressionGroup(taskId, 'right', 380, phase),
    player(`${taskId}-keeper-3`, 716, 555, 'P3', 'keeper'),
    label(`${taskId}-rotation`, 46, 542, 'Porteros cada 8 min · los equipos cambian rol al finalizar la acción', 20, COLORS.soft),
    label(`${taskId}-rule`, 235, 105, phase === 2 ? 'Gol doble si participan los dos MC y se cambia de lado' : 'Portero + 3 centrales + 2 MC contra 5', 20, COLORS.soft),
  ]
  if (phase === 2) objects.push(arrow(`${taskId}-keeper-relay`, [700, 545], [665, 490], COLORS.relay, 'dotted'))
  return scene(objects)
}

const MATCH_RED: readonly Position[] = [[150, 210], [150, 320], [150, 430], [270, 170], [270, 470], [405, 245], [405, 395], [495, 320]]
const MATCH_BLUE: readonly Position[] = [[650, 210], [650, 320], [650, 430], [530, 170], [530, 470], [455, 245], [455, 395], [305, 320]]

function matchScene(phase: Phase, taskId: string): Scene {
  const red = MATCH_RED.map(([x, y], index) => [x + (phase > 0 && index > 4 ? 34 * phase : 0), y] as const)
  const blue = MATCH_BLUE.map(([x, y], index) => [x - (phase > 0 && index > 4 ? 10 * phase : 0), y] as const)
  const mc1: Position = phase === 0 ? [325, 260] : phase === 1 ? [380, 260] : [440, 250]
  const mc2: Position = phase === 0 ? [325, 380] : phase === 1 ? [410, 385] : [485, 390]
  const objects: SceneObj[] = [
    label(`${taskId}-title`, 25, 25, 'PARTIDO · MC DIRIGEN EL ATAQUE', 24),
    label(`${taskId}-count`, 600, 29, '23 JUG. · 3P', 20),
    label(`${taskId}-phase`, 25, 62, `${phase + 1}/3 · ${PHASES[phase]}`, 20, COLORS.soft),
    rectangle(`${taskId}-grass`, 70, 130, 660, 385, COLORS.field),
    rectangle(`${taskId}-boundary`, 70, 130, 660, 385, COLORS.line, 1, true),
    rectangle(`${taskId}-middle`, 290, 130, 220, 385, COLORS.zone, .08),
    arrow(`${taskId}-halfway`, [400, 130], [400, 515], COLORS.line, 'dashed', false),
    { id: `${taskId}-goal-left`, type: 'goal', x: 55, y: 320, size: 84, variant: 'normal', rotation: 270 },
    { id: `${taskId}-goal-right`, type: 'goal', x: 745, y: 320, size: 84, variant: 'normal', rotation: 90 },
    player(`${taskId}-keeper-1`, 92, 320, 'P1', 'keeper'),
    player(`${taskId}-keeper-2`, 708, 320, 'P2', 'keeper'),
    player(`${taskId}-keeper-3`, 720, 565, 'P3', 'keeper'),
    ...red.map(([x, y], index) => player(`${taskId}-red-${index}`, x, y, ['C1', 'C2', 'C3', 'CAI', 'CAD', 'MP1', 'MP2', '9'][index], 'attack')),
    ...blue.map(([x, y], index) => player(`${taskId}-blue-${index}`, x, y, `B${index + 1}`, 'defend')),
    player(`${taskId}-mc-1`, mc1[0], mc1[1], 'MC1', 'joker'),
    player(`${taskId}-mc-2`, mc2[0], mc2[1], 'MC2', 'joker'),
    player(`${taskId}-relay-1`, 315, 565, 'R1', 'relay'),
    player(`${taskId}-relay-2`, 370, 565, 'R2', 'relay'),
    { id: `${taskId}-ball`, type: 'ball', x: phase === 0 ? 112 : phase === 1 ? 365 : 540, y: phase === 0 ? 320 : phase === 1 ? 260 : 320, size: 17 },
    label(`${taskId}-rotation`, 70, 585, 'R1/R2 cambian cada 4 min · porteros: 0-9, 9-18 y 18-27', 20, COLORS.soft),
  ]
  if (phase === 0) {
    objects.push(
      arrow(`${taskId}-start`, [110, 320], red[1], COLORS.attack, 'dashed'),
      arrow(`${taskId}-find-mc`, red[1], mc1, COLORS.attack, 'dashed'),
      label(`${taskId}-shape`, 315, 105, '8 + 2 MC = 3-4-2-1 en posesión', 20, COLORS.soft),
    )
  } else if (phase === 1) {
    objects.push(
      arrow(`${taskId}-mc-pass-1`, red[1], mc1, COLORS.attack, 'dashed'),
      arrow(`${taskId}-mc-pass-2`, mc1, mc2, COLORS.attack, 'dashed'),
      arrow(`${taskId}-wide-run`, red[4], [535, 470], COLORS.attack),
      label(`${taskId}-circulate`, 330, 105, 'MC cercano apoya · MC alejado orienta', 20, COLORS.soft),
    )
  } else {
    objects.push(
      arrow(`${taskId}-switch`, mc2, [560, 470], COLORS.attack, 'dashed'),
      arrow(`${taskId}-final-pass`, [560, 470], red[7], COLORS.attack, 'dashed'),
      arrow(`${taskId}-finish`, red[7], [700, 320], COLORS.attack),
      arrow(`${taskId}-relay-entry`, [315, 550], [270, 490], COLORS.relay, 'dotted'),
      label(`${taskId}-bonus`, 275, 105, 'Gol doble tras cambio de carril y último pase', 20, COLORS.soft),
    )
  }
  return scene(objects)
}

function taskNotes(key: AtaqueMc23TaskKey, phase: Phase): string {
  const mounting = key === 'ataque-mc-posesion'
    ? 'Dos espacios contiguos de 24×18 m. En cada espacio juegan 4 contra 4 con dos MC comodines y un portero exterior. El tercer portero introduce balones y rota.'
    : key === 'ataque-mc-progresion'
      ? 'Dos campos contiguos de 28×22 m. En cada uno juegan cinco atacantes organizados en 3+2 contra cinco defensores y un portero. Se colocan dos puertas de salida en el fondo contrario.'
      : 'Todo el campo chico. Dos equipos de ocho, dos MC comodines con el poseedor, dos porteros, dos relevos de campo y un portero de relevo. En posesión se completa el 3-4-2-1.'
  const detail = [
    'Los jugadores ocupan carriles diferentes. Un MC ofrece apoyo cercano y el otro se coloca en diagonal, preparado para recibir lejos de la presión.',
    'Circular con paciencia. El poseedor atrae; el MC recibe perfilado y encuentra al segundo MC o al tercer jugador. Si no se puede avanzar, se vuelve al portero.',
    'Cuando el rival cierra un lado, el MC cambia la orientación y el equipo progresa por el carril libre. La acción termina en salida, gol, disparo fuera o balón fuera.',
  ][phase]
  const rotation = key === 'ataque-mc-posesion'
    ? 'La pareja de MC cambia cada cuatro minutos al terminar la acción para que todos pasen por el rol. Porteros: 0-7 Eric/Tomás y Daniel introduce; 7-14 Daniel/Eric y Tomás introduce; 14-20 Tomás/Daniel y Eric introduce.'
    : key === 'ataque-mc-progresion'
      ? 'Después de cada acción, ataque y defensa intercambian rol. Los porteros rotan cada ocho minutos: Eric/Tomás, Daniel/Eric y Tomás/Daniel.'
      : 'Los dos relevos sustituyen cada cuatro minutos a un carrilero y un mediapunta. Porteros: 0-9 Eric/Tomás; 9-18 Daniel/Eric; 18-27 Tomás/Daniel.'

  return `## ${PHASES[phase]}

Ataque organizado y distribución de los MC · Infantil 4ª Manolo González.

**Montaje:** ${mounting}

**Desarrollo:** ${detail}

**Relevos:** ${RELAY_RULE} ${rotation}

**Consigna:** ${CUE}

**Observar:** perfil corporal, distancia entre los dos MC, apoyo diagonal, tercer jugador, velocidad del pase y cambio hacia el lado libre.

${DIAGRAM_NOTE}`
}

export function createAtaqueMc23Task(key: AtaqueMc23TaskKey, now = Date.now()): Project {
  const task = ATAQUE_MC_23_TASKS.find(item => item.key === key)
  if (!task) throw new Error('Tarea de ataque organizado para 23 jugadores desconocida')
  const boards: Board[] = ([0, 1, 2] as const).map(phase => ({
    id: `${task.id}-phase-${phase + 1}`,
    title: `${phase + 1} · ${PHASES[phase]}`,
    view: { x: 0, y: 0, w: 800, h: 640 },
    scene: key === 'ataque-mc-posesion' ? possessionScene(phase, task.id) : key === 'ataque-mc-progresion' ? progressionScene(phase, task.id) : matchScene(phase, task.id),
    note: taskNotes(key, phase),
    link: { dur: 2200, ease: 'in-out' },
  }))
  return { id: task.id, name: `${task.title} · Distribución de los MC`, boards, updated: now }
}

export function resolveAtaqueMc23Task(projects: readonly Project[], key: AtaqueMc23TaskKey, now = Date.now()): { project: Project; created: boolean } {
  const task = ATAQUE_MC_23_TASKS.find(item => item.key === key)
  if (!task) throw new Error('Tarea de ataque organizado para 23 jugadores desconocida')
  const existing = projects.find(project => project.id === task.id)
  return existing ? { project: existing, created: false } : { project: createAtaqueMc23Task(key, now), created: true }
}
