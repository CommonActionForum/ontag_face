import { createLiqen,
         changeLiqenColour,
         editLiqen } from '../actions'
import { CALL_API } from './call-api'

export const CHANGE_ANNOTATION_COLOUR = Symbol('change annotation colour')

export default store => next => action => {
  const payload = action[CHANGE_ANNOTATION_COLOUR]

  if (typeof payload === 'undefined') {
    return next(action)
  }

  // Middleware starts here
  const { operation, annotation, colour } = payload
  const state = store.getState()

  if (operation === 'add' && state.colours[colour]) {
    const annotations = store
      .getState()
      .liqens[state.colours[colour]].answer
      .concat(annotation)

    next(editLiqen(state.colours[colour], annotations))
  } else if (operation === 'add' && !state.colours[colour]) {
    const createLiqenAction = createLiqen([annotation])
    const liqen = createLiqenAction[CALL_API].ref

    next(createLiqenAction)
    next(changeLiqenColour(liqen, colour))
  } else if (operation === 'remove' && state.colours[colour]) {
    const annotations = store
      .getState()
      .liqens[state.colours[colour]].answer
      .filter(a => a.toString() !== annotation.toString())

    next(editLiqen(state.colours[colour], annotations))
  } else {
    // This can't happen
    console.error('The annotation %s doesn\'t have the colour %s. ' +
                  'This operation is not possible', annotation, colour)
  }
}
