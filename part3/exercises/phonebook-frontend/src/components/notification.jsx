const Notification = ({ notification }) => {
  if (!notification) {
    return null
  }

  const { message, color } = notification

  const style = {
    color,
    fontStyle: 'bold',
    fontSize: 14,
    borderRadius: 5,
  }

  return (
    <div style={style}>
     {message}
    </div>
  )
}

export default Notification