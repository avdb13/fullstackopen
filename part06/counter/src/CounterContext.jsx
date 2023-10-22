import { createContext, useReducer } from "react"

const counterReducer = (state, action) => {
  switch (action.type) {
    case "INC": return state + 1
    case "DEC": return state - 1
    case "ZERO": return 0
    default: return state
  }
}

const CounterContext = createContext()

export const useCounterValue = () => {
  const reducer = useReducer(counterReducer, 0)
  return reducer[0]
}

export const useCounterDispatch = () => {
  const reducer = useReducer(counterReducer, 0)
  return reducer[1]
}

export const CounterContextProvider = (props) => {
  const [counter, counterDispatch] = useReducer(counterReducer, 0)

  return (
    <CounterContext.Provider value={[counter, counterDispatch]}>
      {props.children}
    </CounterContext.Provider>
  )
}

export default CounterContext
