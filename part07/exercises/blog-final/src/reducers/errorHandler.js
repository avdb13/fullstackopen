import { newNotification } from './notificationReducer'

export const onError = (content) => newNotification(
  {
    content,
    type: 'error',
  },
  5000)


export const onSuccess = (content) => newNotification(
  {
    content,
    type: 'message',
  },
  5000,
)
