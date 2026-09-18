import { emptyMatch, type ArrowObj, type BoxObj, type PlayerObj, type Scene, type SceneObj } from './types.ts'
import type { Board, Project } from './projects.ts'

/** Original, editable session content. No roster names or browser state here. */
export const ZONE2_TASKS = [
  { key: 'parejas', id: 'dania-z2-parejas-20-v2', title: 'Tarea 1 · 2×2 + 2C', detail: '20 jugadores · Dos espacios juntos', players: 20 },
  { key: 'trios', id: 'dania-z2-trios-20-v2', title: 'Tarea 2 · 3×3 + 2C', detail: '20 jugadores · Presión y cobertura', players: 20 },
  { key: 'colectiva', id: 'dania-z2-colectiva-20-v2', title: 'Tarea colectiva · 7×7 + 2P', detail: 'Campo chico · Presión y repliegue', players: 20 },
] as const

export type Zone2TaskKey = typeof ZONE2_TASKS[number]['key']
type Phase = 0 | 1 | 2
type Position = readonly [number, number]

const COLORS = {
  a: '#d93636', b: '#243e78', c: '#f4cc4c', p: '#9ca3af',
  ink: '#26372d', soft: '#627266', field: '#e5eee2', line: '#789582', zone: '#e8be59',
}
const PHASES = ['Organización inicial', 'Pérdida y presión', 'Si superan la presión'] as const
const RELAY_RULE = 'Los relevos entran al terminar su jugada: finalización o disparo fuera. Un robo o una pérdida NO activa el relevo. Los mismos jugadores continúan la transición y, si recuperan, pueden volver a atacar.'
const GENERAL_RULE = 'Zona 2 = tercio central. El más cercano presiona con control; los compañeros cierran pases interiores y dan cobertura. Si el rival supera la presión, proteger el centro y replegar juntos. No perseguir todos el balón.'
const DIAGRAM_NOTE = 'Esquema orientativo, no a escala. A/B son roles, no dorsales de la plantilla. Las tres pizarras representan momentos de una misma jugada; el tiempo de la animación no fija la duración del ejercicio ni de los relevos.'

function label(id: string, x: number, y: number, text: string, size = 20, color = COLORS.ink): SceneObj {
  return { id, type: 'text', x, y, text, size, bold: true, color, rotation: 0 }
}

function rectangle(id: string, left: number, top: number, w: number, h: number, fill: string, opacity = 1, outline = false): BoxObj {
  return { id, type: 'box', shape: outline ? 'outline' : 'rect', x: left + w / 2, y: top + h / 2, w, h, fill, opacity, rotation: 0 }
}

function player(id: string, x: number, y: number, text: string, side: 'a' | 'b' | 'c' | 'p'): PlayerObj {
  return { id, type: 'player', x, y, r: 14, color: COLORS[side], label: text, name: '', namePos: 'bottom', nameSize: 18, nameDisplay: 'full' }
}

function arrow(id: string, from: Position, to: Position, color: string, dash: ArrowObj['dash'] = 'solid', head = true): ArrowObj {
  return { id, type: 'arrow', x1: from[0], y1: from[1], x2: to[0], y2: to[1], mx: (from[0] + to[0]) / 2, my: (from[1] + to[1]) / 2, color, dash, width: head ? 3 : 1.5, curved: false, head, headSize: 9 }
}

function lossMark(id: string, x: number, y: number): BoxObj {
  return { id, type: 'box', shape: 'ellipse', x, y, w: 68, h: 62, fill: COLORS.zone, opacity: .42, rotation: 0 }
}

function scene(objects: SceneObj[]): Scene {
  return {
    version: 4, pitch: 'dania-session', board: { w: 800, h: 640 }, match: emptyMatch(),
    arrowLegend: { solid: 'Presión o desplazamiento', dashed: 'Pase / salida rival', dotted: 'Repliegue' }, objects,
  }
}

/** Same identities across phases let the native sequence player interpolate. */
const SMALL_POSITIONS: Record<2 | 3, readonly { a: readonly Position[]; b: readonly Position[]; ball: Position }[]> = {
  2: [
    { a: [[146, 373], [273, 344]], b: [[185, 282], [280, 283]], ball: [159, 360] },
    { a: [[188, 352], [250, 391]], b: [[235, 324], [283, 396]], ball: [244, 340] },
    { a: [[191, 452], [279, 452]], b: [[225, 367], [247, 411]], ball: [257, 428] },
  ],
  3: [
    { a: [[139, 379], [276, 379], [205, 345]], b: [[168, 280], [284, 280], [233, 302]], ball: [151, 364] },
    { a: [[189, 344], [257, 391], [159, 385]], b: [[235, 315], [297, 409], [137, 332]], ball: [244, 332] },
    { a: [[205, 453], [279, 453], [130, 446]], b: [[235, 371], [256, 412], [161, 405]], ball: [258, 430] },
  ],
}

function smallField(taskId: string, fieldIndex: number, active: 2 | 3, phase: Phase): SceneObj[] {
  const dx = fieldIndex * 392
  const id = `${taskId}-field-${fieldIndex + 1}`
  const p = SMALL_POSITIONS[active][phase]
  const objects: SceneObj[] = [
    rectangle(`${id}-grass`, 51 + dx, 150, 306, 346, COLORS.field),
    rectangle(`${id}-boundary`, 51 + dx, 150, 306, 346, COLORS.line, 1, true),
    rectangle(`${id}-zone2`, 84 + dx, 251, 240, 169, COLORS.zone, .22),
    arrow(`${id}-zone2-top`, [84 + dx, 251], [324 + dx, 251], COLORS.line, 'dashed', false),
    arrow(`${id}-zone2-bottom`, [84 + dx, 420], [324 + dx, 420], COLORS.line, 'dashed', false),
    label(`${id}-heading`, 51 + dx, 102, `CAMPO ${fieldIndex + 1} · 10 JUGADORES`),
    label(`${id}-zone-label`, 90 + dx, 224, 'ZONA 2', 20, COLORS.soft),
    { id: `${id}-goal-main`, type: 'goal', x: 204 + dx, y: 150, size: 72, variant: 'normal' },
    { id: `${id}-goal-left`, type: 'goal', x: 127 + dx, y: 489, size: 46, variant: 'small', rotation: 180 },
    { id: `${id}-goal-right`, type: 'goal', x: 281 + dx, y: 489, size: 46, variant: 'small', rotation: 180 },
    player(`${id}-keeper`, 204 + dx, 191, `P${fieldIndex + 1}`, 'p'),
    player(`${id}-neutral-1`, 69 + dx, 332, 'C1', 'c'),
    player(`${id}-neutral-2`, 340 + dx, 332, 'C2', 'c'),
    ...p.a.map(([x, y], i) => player(`${id}-a-${i + 1}`, x + dx, y, `A${i + 1}`, 'a')),
    ...p.b.map(([x, y], i) => player(`${id}-b-${i + 1}`, x + dx, y, `B${i + 1}`, 'b')),
    { id: `${id}-ball`, type: 'ball', x: p.ball[0] + dx, y: p.ball[1], size: 17 },
    label(`${id}-relay-label`, 51 + dx, 517, 'RELEVOS · al terminar'),
  ]

  const waits = active === 2
    ? [
        { x: 114, side: 'a' as const, label: 'A3' },
        { x: 204, side: 'b' as const, label: 'B3' },
        { x: 294, side: 'c' as const, label: 'C3' },
      ]
    : [{ x: 204, side: 'p' as const, label: 'R1' }]
  waits.forEach((wait, i) => {
    objects.push(player(`${id}-${wait.side}-relay-${i + 1}`, wait.x + dx, 562, wait.label, wait.side))
  })

  if (phase === 0) {
    objects.push(
      arrow(`${id}-initial-pass`, [164 + dx, 360], [250 + dx, active === 2 ? 347 : 378], COLORS.a, 'dashed'),
      arrow(`${id}-initial-attack`, [295 + dx, 241], [246 + dx, 196], COLORS.a),
    )
  } else if (phase === 1) {
    objects.push(
      lossMark(`${id}-loss`, p.ball[0] + dx, p.ball[1]),
      arrow(`${id}-pressure`, [206 + dx, 343], [224 + dx, 333], COLORS.a),
      arrow(`${id}-cover`, [298 + dx, 362], [266 + dx, 382], COLORS.a),
      arrow(`${id}-outlet`, [251 + dx, 353], [277 + dx, 377], COLORS.b, 'dashed'),
    )
    if (active === 3) objects.push(arrow(`${id}-inside-cover`, [133 + dx, 357], [152 + dx, 370], COLORS.a))
  } else {
    objects.push(
      arrow(`${id}-escaped-pass`, [233 + dx, 388], [247 + dx, 414], COLORS.b, 'dashed'),
      arrow(`${id}-retreat-1`, [190 + dx, 379], [p.a[0][0] + dx, 431], COLORS.a, 'dotted'),
      arrow(`${id}-retreat-2`, [296 + dx, 413], [284 + dx, 436], COLORS.a, 'dotted'),
    )
    if (active === 3) objects.push(arrow(`${id}-retreat-3`, [129 + dx, 383], [130 + dx, 428], COLORS.a, 'dotted'))
  }
  return objects
}

function smallScene(active: 2 | 3, phase: Phase, taskId: string): Scene {
  return scene([
    label(`${taskId}-title`, 25, 25, `TAREA ${active === 2 ? 1 : 2} · ${active}×${active} + 2C`, 24),
    label(`${taskId}-count`, 494, 29, '20 JUGADORES · 2 CAMPOS'),
    label(`${taskId}-phase`, 25, 62, `${phase + 1}/3 · ${PHASES[phase]}`, 20, COLORS.soft),
    ...smallField(taskId, 0, active, phase),
    ...smallField(taskId, 1, active, phase),
    label(`${taskId}-legend`, 26, 596, 'A: rojo · B: azul · C: comodín · P: portero', 20, COLORS.soft),
  ])
}

const COLLECTIVE_POSITIONS: readonly { a: readonly Position[]; b: readonly Position[]; ball: Position }[] = [
  {
    a: [[177, 211], [153, 327], [176, 432], [299, 225], [300, 387], [521, 209], [521, 427]],
    b: [[246, 280], [246, 451], [378, 191], [376, 367], [574, 204], [574, 325], [574, 445]],
    ball: [319, 376],
  },
  {
    a: [[238, 211], [229, 324], [239, 440], [306, 267], [315, 370], [450, 225], [433, 422]],
    b: [[254, 281], [286, 449], [359, 193], [350, 348], [574, 204], [574, 325], [574, 445]],
    ball: [340, 363],
  },
  {
    a: [[149, 216], [145, 327], [149, 435], [215, 229], [212, 404], [299, 216], [306, 443]],
    b: [[241, 309], [273, 407], [344, 206], [350, 348], [565, 208], [555, 326], [565, 444]],
    ball: [231, 323],
  },
]

function collectiveScene(phase: Phase, taskId: string): Scene {
  const p = COLLECTIVE_POSITIONS[phase]
  const objects: SceneObj[] = [
    label(`${taskId}-title`, 25, 25, 'COLECTIVA · 7×7 + 2P', 24),
    label(`${taskId}-count`, 489, 29, '20 JUGADORES · 4 RELEVOS'),
    label(`${taskId}-phase`, 25, 62, `${phase + 1}/3 · ${PHASES[phase]}`, 20, COLORS.soft),
    rectangle(`${taskId}-grass`, 56, 151, 600, 357, COLORS.field),
    rectangle(`${taskId}-boundary`, 56, 151, 600, 357, COLORS.line, 1, true),
    rectangle(`${taskId}-zone2`, 245, 152, 210, 355, COLORS.zone, .22),
    arrow(`${taskId}-third-left`, [245, 151], [245, 508], COLORS.line, 'dashed', false),
    arrow(`${taskId}-third-right`, [455, 151], [455, 508], COLORS.line, 'dashed', false),
    arrow(`${taskId}-halfway`, [356, 151], [356, 508], COLORS.line, 'solid', false),
    rectangle(`${taskId}-penalty-left`, 56, 253, 70, 150, COLORS.line, 1, true),
    rectangle(`${taskId}-penalty-right`, 586, 253, 70, 150, COLORS.line, 1, true),
    label(`${taskId}-zone1-label`, 70, 118, 'ZONA 1', 20, COLORS.soft),
    label(`${taskId}-zone2-label`, 281, 118, 'ZONA 2', 20, COLORS.soft),
    label(`${taskId}-zone3-label`, 520, 118, 'ZONA 3', 20, COLORS.soft),
    { id: `${taskId}-goal-left`, type: 'goal', x: 42, y: 329, size: 84, variant: 'normal', rotation: 270 },
    { id: `${taskId}-goal-right`, type: 'goal', x: 670, y: 329, size: 84, variant: 'normal', rotation: 90 },
    player(`${taskId}-keeper-a`, 89, 327, 'P1', 'p'),
    player(`${taskId}-keeper-b`, 621, 327, 'P2', 'p'),
    ...p.a.map(([x, y], i) => player(`${taskId}-a-${i + 1}`, x, y, `A${i + 1}`, 'a')),
    ...p.b.map(([x, y], i) => player(`${taskId}-b-${i + 1}`, x, y, `B${i + 1}`, 'b')),
    { id: `${taskId}-ball`, type: 'ball', x: p.ball[0], y: p.ball[1], size: 17 },
    label(`${taskId}-relay-label`, 698, 154, 'RELEVOS', 20, COLORS.soft),
    player(`${taskId}-a-relay-1`, 741, 216, 'R1', 'a'),
    player(`${taskId}-a-relay-2`, 741, 269, 'R2', 'a'),
    player(`${taskId}-b-relay-1`, 741, 390, 'R3', 'b'),
    player(`${taskId}-b-relay-2`, 741, 443, 'R4', 'b'),
    label(`${taskId}-direction`, 56, 535, 'A ataca a la derecha · B, a la izquierda', 20, COLORS.soft),
    label(`${taskId}-relay-rule`, 56, 567, 'Relevos al finalizar; nunca por perder el balón.', 20, COLORS.soft),
    label(`${taskId}-legend`, 56, 598, 'A: rojo · B: azul · P: portero · R: relevo', 20, COLORS.soft),
  ]
  if (phase === 0) {
    objects.push(
      arrow(`${taskId}-initial-pass`, [337, 369], [389, 317], COLORS.a, 'dashed'),
      arrow(`${taskId}-initial-run`, [444, 375], [515, 374], COLORS.a),
    )
  } else if (phase === 1) {
    objects.push(
      lossMark(`${taskId}-loss`, 340, 363),
      arrow(`${taskId}-pressure`, [312, 347], [331, 347], COLORS.a),
      arrow(`${taskId}-close-interior`, [298, 289], [296, 328], COLORS.a),
      arrow(`${taskId}-cover`, [363, 324], [336, 316], COLORS.a),
      arrow(`${taskId}-compact`, [202, 327], [213, 327], COLORS.a),
      arrow(`${taskId}-outlet`, [329, 338], [275, 292], COLORS.b, 'dashed'),
    )
  } else {
    objects.push(
      arrow(`${taskId}-escaped-pass`, [330, 345], [263, 319], COLORS.b, 'dashed'),
      arrow(`${taskId}-retreat-high`, [328, 268], [237, 237], COLORS.a, 'dotted'),
      arrow(`${taskId}-retreat-low`, [340, 415], [234, 405], COLORS.a, 'dotted'),
      arrow(`${taskId}-protect-center`, [207, 273], [165, 304], COLORS.a, 'dotted'),
    )
  }
  return scene(objects)
}

function smallNotes(active: 2 | 3, phase: Phase): string {
  const relays = active === 2 ? '3 relevos (uno de A, uno de B y uno de comodín)' : '1 relevo rotatorio'
  const rotation = active === 2
    ? 'Al finalizar entran A3, B3 y C3: cada uno sustituye a un jugador de su mismo rol. Quienes salen pasan a la espera. Alternar qué jugador sale y rotar los comodines para repartir la participación. Cada campo cambia al terminar su propia jugada, sin esperar al otro.'
    : 'Al finalizar entra R1 en el siguiente rol del orden fijado A → B → C; quien sale pasa a ser el nuevo relevo. Alternar la posición concreta dentro de cada rol y mantener al portero. Cada campo rota por separado.'
  const phaseNotes = [
    'A inicia con balón en zona 2 y ataca la portería grande. B intenta recuperar y finalizar en cualquiera de las dos miniporterías opuestas. Los dos comodines exteriores ayudan al poseedor, también tras un robo. P defiende la portería grande. Se juega libre de toques; no anunciar ni provocar artificialmente la pérdida.',
    active === 2
      ? 'Ejemplo: B roba en zona 2. A1 frena al poseedor y orienta hacia fuera; A2 cierra el pase interior hacia las miniporterías y ayuda sin ir ambos al balón. B decide por dónde salir, con los comodines ahora de su lado. Si A recupera, vuelve a atacar la portería grande: nadie se releva todavía.'
      : 'Ejemplo: B roba en zona 2. A1 presiona al poseedor, A2 cierra la salida interior y A3 da cobertura y equilibra. B busca una salida real hacia las miniporterías, ayudado por los comodines. Intercambiar quién presiona según la cercanía, no siempre el mismo jugador.',
    'La salida de B supera la primera presión. A deja de perseguir, se coloca por dentro y entre el balón y sus miniporterías, y repliega junto. B sigue hasta finalizar. Si A recupera antes, puede volver a atacar. La jugada no se detiene por cruzar la línea de zona 2.',
  ][phase]

  return `## ${PHASES[phase]}

Organización defensiva · Presión tras pérdida en zona 2 · Infantil.

**Montaje:** dos campos contiguos y simultáneos dentro del campo chico. En cada uno: ${active} A + ${active} B + 2 comodines + 1 portero + ${relays} = 10. Total: 20 jugadores, incluidos 2 porteros. Como referencia, usar 18×14 m en la tarea 1 y 20×16 m en la tarea 2, reduciendo o ampliando según el espacio real y la continuidad. Una portería con portero y dos puertas de conos por campo.

**Desarrollo:** ${phaseNotes}

**Relevos:** ${RELAY_RULE} ${rotation} Cambiar los comodines y los roles de ataque/defensa entre bloques de jugadas. Si otro balón sale del campo, el entrenador señala el final antes de dar la siguiente salida; no introducir un segundo balón durante una transición.

**Consigna:** ${GENERAL_RULE}

**Observar:** reacción del más cercano, cierre del pase interior y ayuda del compañero. Valorar también un repliegue bien decidido; no exigir recuperar siempre ni fijar segundos obligatorios de presión.

${DIAGRAM_NOTE}`
}

function collectiveNotes(phase: Phase): string {
  const phaseNotes = [
    'A inicia en zona 2 y ataca hacia la derecha. Mantener la circulación y los cambios de orientación trabajados en ataque. B puede robar de forma natural y contraatacar a la izquierda. El espacio se divide en tres tercios; el central está sombreado. Juego libre de toques; no regalar una pérdida para cumplir el ejercicio.',
    'Ejemplo: B roba en zona 2. A5 es el más cercano y presiona con control; A4 y A6 cierran líneas interiores, y la línea de atrás se aproxima manteniendo protección de la portería izquierda. Los alejados reducen distancias: no van todos al balón. B elige una salida real. Si A recupera, vuelve a atacar sin cambios.',
    'B supera la primera presión y progresa hacia la portería izquierda. A protege el centro, vuelve por detrás del balón y forma un bloque compacto. El jugador cercano temporiza mientras llegan sus compañeros. El juego continúa hasta finalizar; no parar porque el balón sale de zona 2.',
  ][phase]

  return `## ${PHASES[phase]}

Organización defensiva · Presión tras pérdida en zona 2 · Infantil.

**Montaje:** 7 A contra 7 B de campo + 2 porteros + 4 relevos = 20. Dos relevos por equipo, fuera del terreno. Usar todo el espacio disponible del campo chico, con dos porterías y tres zonas longitudinales. El dibujo muestra una distribución inicial orientativa 3–2–2, no asignaciones fijas de la plantilla.

**Desarrollo:** ${phaseNotes}

**Relevos:** ${RELAY_RULE} Antes de cada salida, asignar a R1/R2 dos posiciones de A y a R3/R4 dos de B. Al finalizar, cada relevo ocupa únicamente la posición acordada y quien sale espera. Alternar las posiciones sustituidas para repartir la participación; los porteros no forman parte de esos cuatro relevos. Reanudar desde zona 2. Si otro balón sale, señalar final de jugada antes de la siguiente salida.

**Consigna:** ${GENERAL_RULE} Presionar juntos cuando hay cercanía y ayuda; si no las hay, temporizar y recuperar la organización. Cambiar el equipo que inicia entre bloques de jugadas.

**Observar:** quién presiona, qué pase cierran los siguientes y cómo protege el centro el resto. Reconocer tanto la recuperación como el repliegue adecuado. Sin castigos físicos ni obligación de recuperar en un tiempo fijo.

${DIAGRAM_NOTE}`
}

export function createZone2Task(key: Zone2TaskKey, now = Date.now()): Project {
  const task = ZONE2_TASKS.find(item => item.key === key)
  if (!task) throw new Error('Tarea de zona 2 desconocida')
  const boards: Board[] = ([0, 1, 2] as const).map(phase => ({
    id: `${task.id}-phase-${phase + 1}`,
    title: `${phase + 1} · ${PHASES[phase]}`,
    view: { x: 0, y: 0, w: 800, h: 640 },
    scene: key === 'colectiva' ? collectiveScene(phase, task.id) : smallScene(key === 'parejas' ? 2 : 3, phase, task.id),
    note: key === 'colectiva' ? collectiveNotes(phase) : smallNotes(key === 'parejas' ? 2 : 3, phase),
    link: { dur: 2200, ease: 'in-out' },
  }))
  return { id: task.id, name: `${task.title} · Zona 2`, boards, updated: now }
}

/** Reopening a task must never restore the original over the coach's edits. */
export function resolveZone2Task(projects: readonly Project[], key: Zone2TaskKey, now = Date.now()): { project: Project; created: boolean } {
  const task = ZONE2_TASKS.find(item => item.key === key)
  if (!task) throw new Error('Tarea de zona 2 desconocida')
  const existing = projects.find(project => project.id === task.id)
  return existing ? { project: existing, created: false } : { project: createZone2Task(key, now), created: true }
}
