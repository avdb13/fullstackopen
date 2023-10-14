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

  const buttonStyle = 'bg-indigo-500 rounded-md p-2 m-4 text-white text-sm hover:bg-indigo-600 ease-in-out duration-200'

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
