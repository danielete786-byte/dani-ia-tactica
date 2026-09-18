import type { SceneObj } from './types.ts'

export function isTextOptionField(field: string | undefined): boolean {
  return field === 'name' || field === 'label' || field === 'mname' || field === 'box-label'
}

/** Keep text edits in scene state immediately, not only after a blur event. */
export function updateOptionText(object: SceneObj, field: string, value: string): boolean {
  if (object.type === 'player' && (field === 'name' || field === 'label')) {
    object[field] = value
    return true
  }
  if (object.type === 'marker' && field === 'mname') {
    object.name = value
    return true
  }
  if (object.type === 'box' && field === 'box-label') {
    object.label = value
    return true
  }
  return false
}
