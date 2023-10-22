import { useState } from "react"

const History = ({ clicks }) => {
  if (clicks.length === 0) {
    return (
      <div>Use the app by pressing the buttons</div>
    )
  }

  return (
    <div>
      button press history: {clicks.join(' ')}
    </div>
  )
}

const Button = ({ handleClick, text }) => <button onClick={handleClick}>{text}</button>

const App = () => {
  const [left, setLeft] = useState(0)
  const [right, setRight] = useState(0)
  const [clicks, setClicks] = useState([])
  const [total, setTotal] = useState(0)

  const handleLeft = () => {
    const l = left + 1
    setLeft(l)
    setTotal(l + right)
    setClicks(clicks.concat('L'))
  }

  const handleRight = () => {
    const r = right + 1
    setRight(r)
    setTotal(r + left)
    setClicks(clicks.concat('R'))
  }

  return (
    <div>
      {left}
      <Button handleClick={handleLeft} text="left" />
      <Button handleClick={handleRight} text="right" />
      {right}
      <History clicks={clicks} />
    </div>
  )
}

export default App
