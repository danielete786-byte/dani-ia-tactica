import type { LoadedTeam } from './teams'
import type { PlayerObj } from './types'

/** Owner-provided roster, included with the private app on every device.
 * Numbers and outfield positions have not been supplied. Daily absences do
 * not change membership. Do not send this roster to the public team APIs.
 */
export const daniaTeam: LoadedTeam = {
  name: 'Infantil Demo Albolote',
  color: '#007fc8',
  colours: ['#007fc8', '#ffffff'],
  side: 'home',
  roster: [
    { name: 'Adam Navarro Ruiz', number: '', position: '' },
    { name: 'Alex Molina Serra', number: '', position: '' },
    { name: 'Antonio Vega Ríos', number: '', position: '' },
    { name: 'Cristian Ortega Vidal', number: '', position: '' },
    { name: 'Daniel Campos León', number: '', position: 'GK' },
    { name: 'Darío Peña Soler', number: '', position: '' },
    { name: 'David Herrera Cruz', number: '', position: '' },
    { name: 'Eric Marín Soto', number: '', position: 'GK' },
    { name: 'Fran Delgado Pons', number: '', position: '' },
    { name: 'Héctor Blanco Pascual', number: '', position: '' },
    { name: 'Hugo Sáez Nieto', number: '', position: '' },
    { name: 'Ignacio Gil Ramos', number: '', position: '' },
    { name: 'Jad Benali Torres', number: '', position: '' },
    { name: 'Javier Soto Aguilar', number: '', position: '' },
    { name: 'Jesús Prieto Mora', number: '', position: '' },
    { name: 'José Antonio Reyes Luna', number: '', position: '' },
    { name: 'José Luis Castro Díez', number: '', position: '' },
    { name: 'Liam Ferrer Vidal', number: '', position: '' },
    { name: 'Martín Iglesias Rueda', number: '', position: '' },
    { name: 'Pablo Navarro Sol', number: '', position: '' },
    { name: 'Pablo Ruiz Cano', number: '', position: '' },
    { name: 'Sergio Domínguez Peña', number: '', position: '' },
    { name: 'Tomás Álvarez Rico', number: '', position: 'GK' },
    { name: 'Víctor Méndez Calvo', number: '', position: '' },
    { name: 'Víctor Santos Ibáñez', number: '', position: '' },
  ],
}

type RosterChoice = LoadedTeam['roster'][number] & { team: string }

export function isRosterGoalkeeper(position: string): boolean {
  return /^(gk|goalkeeper|keeper|por|portero)\b/i.test(position.trim())
}

/** Keep the canonical squad available after a blank board, on an existing
 * device, or alongside other clubs. Never overwrite the user's team setup.
 */
export function withDaniaRoster(choices: readonly RosterChoice[]): RosterChoice[] {
  return [
    ...daniaTeam.roster.map(player => ({ ...player, team: daniaTeam.name })),
    ...choices.filter(player => player.team !== daniaTeam.name),
  ]
}

/** Apply identity without moving the token or changing its other styling. */
export function applyDaniaRosterChoice(
  player: PlayerObj,
  choice: RosterChoice,
  kitColor = daniaTeam.color,
  goalkeeperColor = '#6b7280',
): boolean {
  if (choice.team !== daniaTeam.name) return false
  const previous = daniaTeam.roster.find(member => member.name === player.name)
  player.name = choice.name
  player.team = daniaTeam.name
  // Do not carry another player's shirt number into an unnumbered roster.
  player.label = choice.number
  if (isRosterGoalkeeper(choice.position)) player.color = goalkeeperColor
  else if (previous && isRosterGoalkeeper(previous.position)
    && ['#6b7280', '#d1d5db'].includes(player.color.toLowerCase())) player.color = kitColor
  return true
}
