import { useSelector } from 'react-redux'

const Notification = () => {
  const message = useSelector((state) => state.notification)

  if (message === null) {
    return null
  }
  const errorStyle = 'bg-red-100 border-l-4 border-red-500 text-red-400 p-4'
  const messageStyle = 'bg-green-100 border-l-4 border-green-500 text-green-400 p-4'

  switch (message.type) {
  case 'error':
    return <div className={errorStyle}>
      <p>{message.content}</p>
    </div>
  case 'message':
    return <div className={messageStyle}>
      <p>{message.content}</p>
    </div>

  }
}

export default Notification
