const ADD_DEVICES = 'ADD_DEVICES_BM'
const UPDATE_DEVICE = 'UPDATE_DEVICE_BM'
const REMOVE_DEVICE = 'REMOVE_DEVICE_BM'

export const reducer = (state = {}, action) => {
  switch (action.type) {
    case ADD_DEVICES:
      return { ...action.payload }
    case UPDATE_DEVICE:
      return state[action.payload.key] ? { ...state } : { ...state, [action.payload.key]: action.payload }
    case REMOVE_DEVICE:
      const { [action.payload]: removedItem, ...remainingDevices } = state
      return remainingDevices
    default:
      return state
  }
}

export const actions = { ADD_DEVICES, REMOVE_DEVICE, UPDATE_DEVICE };