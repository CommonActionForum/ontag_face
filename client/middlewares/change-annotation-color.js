import { createLiqen,
         changeLiqenColor,
         editLiqen } from '../actions'
import { CALL_API } from './call-api'

export const CHANGE_ANNOTATION_COLOR = Symbol('change annotation color')

export default store => next => action => {
  const payload = action[CHANGE_ANNOTATION_COLOR]

  if (typeof payload === 'undefined') {
    return next(action)
  }

  // Middleware starts here
  const { operation, annotation, color } = payload
  const state = store.getState()

  if (operation === 'add' && state.colors[color]) {
    const annotations = store
      .getState()
      .liqens[state.colors[color]].answer
      .concat(annotation)

    next(editLiqen(state.colors[color], annotations))
  } else if (operation === 'add' && !state.colors[color]) {
    const createLiqenAction = createLiqen([annotation])
    const liqen = createLiqenAction[CALL_API].cid

    next(createLiqenAction)
    next(changeLiqenColor(liqen, color))
  } else if (operation === 'remove' && state.colors[color]) {
    const annotations = store
      .getState()
      .liqens[state.colors[color]].answer
      .filter(a => a.toString() !== annotation.toString())

    next(editLiqen(state.colors[color], annotations))
  } else {
    // This can't happen
    console.error('The annotation %s doesn\'t have the color %s. ' +
                  'This operation is not possible', annotation, color)
  }
}
