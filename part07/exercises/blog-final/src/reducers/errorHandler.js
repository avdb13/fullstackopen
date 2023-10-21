import { newNotification } from './notificationReducer'

export const onError = (e, content) => {
  switch (e.message) {
  case 'Network Error':
    return newNotification(
      {
        content: 'backend refused connection',
        type: 'error',
      },
      5000,
    )
  default:
    return newNotification(
      {
        content,
        type: 'error',
      },
      5000)
  }
}


export const onSuccess = (content) => newNotification(
  {
    content,
    type: 'message',
  },
  5000,
)
