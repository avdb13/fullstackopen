const filterReducer = (state = '', action) => {
  switch (action.type) {
  case 'FILTER':
    return action.payload.filter
  default:
    return state
  }
}

export const newFilter = (filter) => {
  return {
    type: 'FILTER',
    payload: { filter }
  }
}

export default filterReducer
