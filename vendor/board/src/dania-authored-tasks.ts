import { ZONE2_TASKS, createZone2Task, resolveZone2Task, type Zone2TaskKey } from './dania-zone2.ts'
import { SALIDA_3421_TASKS, createSalida3421Task, resolveSalida3421Task, type Salida3421TaskKey } from './dania-salida-3421.ts'
import { REPLIEGUE_21_TASKS, createRepliegue21Task, resolveRepliegue21Task, type Repliegue21TaskKey } from './dania-repliegue-21.ts'
import { ULTIMO_PASE_22_TASKS, createUltimoPase22Task, resolveUltimoPase22Task, type UltimoPase22TaskKey } from './dania-ultimo-pase-22.ts'
import { ATAQUE_MC_23_TASKS, createAtaqueMc23Task, resolveAtaqueMc23Task, type AtaqueMc23TaskKey } from './dania-ataque-mc-23.ts'
import type { Project } from './projects.ts'

export type DaniaTaskKey = Zone2TaskKey | Salida3421TaskKey | Repliegue21TaskKey | UltimoPase22TaskKey | AtaqueMc23TaskKey

export const DANIA_TASK_GROUPS = [
  {
    id: 'ataque-mc-23',
    title: 'Ataque organizado · Distribución de los MC',
    help: 'Tres tareas para 23 jugadores y tres porteros en campo chico: apoyar, circular y cambiar de orientación.',
    tasks: ATAQUE_MC_23_TASKS,
  },
  {
    id: 'ultimo-pase-22',
    title: 'Ataque organizado · Último pase',
    help: 'Tres tareas para 22 jugadores y tres porteros: encontrar al mediapunta, filtrar y ocupar el área.',
    tasks: ULTIMO_PASE_22_TASKS,
  },
  {
    id: 'repliegue-21',
    title: 'Defensa organizada · Repliegue',
    help: 'Tres tareas para 21 jugadores en campo chico: reconocer cuándo abandonar la presión y volver juntos.',
    tasks: REPLIEGUE_21_TASKS,
  },
  {
    id: 'salida-3421',
    title: 'Salida de balón · 3-4-2-1',
    help: 'Tres tareas nuevas con tres momentos editables: estructura, movimientos de apoyo y progresión.',
    tasks: SALIDA_3421_TASKS,
  },
  {
    id: 'zona-2',
    title: 'Presión tras pérdida · Zona 2',
    help: 'Tres tareas con organización inicial, presión y repliegue.',
    tasks: ZONE2_TASKS,
  },
] as const

const isSalidaKey = (key: DaniaTaskKey): key is Salida3421TaskKey => SALIDA_3421_TASKS.some(task => task.key === key)
const isRepliegueKey = (key: DaniaTaskKey): key is Repliegue21TaskKey => REPLIEGUE_21_TASKS.some(task => task.key === key)
const isUltimoPaseKey = (key: DaniaTaskKey): key is UltimoPase22TaskKey => ULTIMO_PASE_22_TASKS.some(task => task.key === key)
const isAtaqueMcKey = (key: DaniaTaskKey): key is AtaqueMc23TaskKey => ATAQUE_MC_23_TASKS.some(task => task.key === key)

export function createDaniaTask(key: DaniaTaskKey, now = Date.now()): Project {
  if (isAtaqueMcKey(key)) return createAtaqueMc23Task(key, now)
  if (isUltimoPaseKey(key)) return createUltimoPase22Task(key, now)
  if (isRepliegueKey(key)) return createRepliegue21Task(key, now)
  return isSalidaKey(key) ? createSalida3421Task(key, now) : createZone2Task(key, now)
}

export function resolveDaniaTask(projects: readonly Project[], key: DaniaTaskKey, now = Date.now()): { project: Project; created: boolean } {
  if (isAtaqueMcKey(key)) return resolveAtaqueMc23Task(projects, key, now)
  if (isUltimoPaseKey(key)) return resolveUltimoPase22Task(projects, key, now)
  if (isRepliegueKey(key)) return resolveRepliegue21Task(projects, key, now)
  return isSalidaKey(key) ? resolveSalida3421Task(projects, key, now) : resolveZone2Task(projects, key, now)
}
