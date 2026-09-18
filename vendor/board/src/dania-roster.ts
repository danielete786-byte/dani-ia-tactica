import type { LoadedTeam } from './teams'
import type { PlayerObj } from './types'

/** Owner-provided roster, included with the private app on every device.
 * Numbers and outfield positions have not been supplied. Daily absences do
 * not change membership. Do not send this roster to the public team APIs.
 */
export const daniaTeam: LoadedTeam = {
  name: 'Infantil 4ª Manolo González',
  color: '#007fc8',
  colours: ['#007fc8', '#ffffff'],
  side: 'home',
  roster: [
    { name: 'Adam Echanachine Rodríguez', number: '', position: '' },
    { name: 'Alex Martínez Checa', number: '', position: '' },
    { name: 'Antonio Portilla Merino', number: '', position: '' },
    { name: 'Cristian Cirre Fernández', number: '', position: '' },
    { name: 'Daniel Terrón Alarcos', number: '', position: 'GK' },
    { name: 'Darío Garrido', number: '', position: '' },
    { name: 'David Moreno Milena', number: '', position: '' },
    { name: 'Eric Sánchez', number: '', position: 'GK' },
    { name: 'Francisco Emanuel Carmona Postigo', number: '', position: '' },
    { name: 'Héctor Carrión Vicente', number: '', position: '' },
    { name: 'Hugo Gómez Medina', number: '', position: '' },
    { name: 'Ignacio Ruiz Molinero', number: '', position: '' },
    { name: 'Jad Mahmouh Bouramtane', number: '', position: '' },
    { name: 'Javier Valenzuela Romero', number: '', position: '' },
    { name: 'Jesús Lozano Hernández', number: '', position: '' },
    { name: 'José Antonio Gutiérrez Sousa', number: '', position: '' },
    { name: 'José Luis Sevilla Martín', number: '', position: '' },
    { name: 'Liam Falgout', number: '', position: '' },
    { name: 'Martín Fernández Jiménez', number: '', position: '' },
    { name: 'Pablo Fernández', number: '', position: '' },
    { name: 'Pablo Román Cantarero', number: '', position: '' },
    { name: 'Sergio Ureña', number: '', position: '' },
    { name: 'Tomás Moreno Baldacci', number: '', position: 'GK' },
    { name: 'Víctor Córdoba Paradela', number: '', position: '' },
    { name: 'Víctor Pareja Páez', number: '', position: '' },
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
