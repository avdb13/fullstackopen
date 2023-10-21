import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import AnonymousSvg from './svgs/User'
import UserSvg from './svgs/User'

dayjs.extend(relativeTime)

const Comment = ({ comment }) => (
  <li className='flex flex-col pb-4'>
    <div className='flex gap-1 grow justify-between m-2 items-center'>
      <div className='flex gap-1 items-center font-bold'>
        <UserSvg />
        <p>anonymous</p>
      </div>
      <p className='text-sm text-gray-500'>{dayjs(comment.added).fromNow()}</p>
    </div>
    <p className='px-2 text-xs'>{comment.body}</p>
  </li>
)

export default Comment