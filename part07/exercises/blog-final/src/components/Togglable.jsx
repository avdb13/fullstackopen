import { useImperativeHandle } from 'react'
import { forwardRef } from 'react'
import { useState } from 'react'

const Togglable = forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible? 'none' : '' }
  const showWhenVisible = { display: visible? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  useImperativeHandle(ref, () => {
    return { toggleVisibility }
  })

  const buttonStyle = 'shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none font-bold rounded text-white py-1 px-4 m-4'
  return (
    <div>
      <div style={hideWhenVisible}>
        <button className={buttonStyle} onClick={toggleVisibility}>{props.buttonLabel}</button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <button className={buttonStyle} onClick={toggleVisibility}>cancel</button>
      </div>
    </div>
  )
})

Togglable.displayName = 'Togglable'

export default Togglable