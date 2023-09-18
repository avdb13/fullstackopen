import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from '../../src/components/Blog'

describe('<Blog />', () => {
  let container

  beforeEach(() => {
    const blog = {
      title: 'testing article',
      url: 'https://testing-library.com',
      author: 'Kent C. Dodds',
      likes: 12,
      user: { name: 'Testing Library' }
    }

    container = render(<Blog blog={blog} />).container
  })

  test('a blog renders the blog\'s title and author by default', async () => {
    const titleEl = screen.getByText('testing article')
    const urlEl = screen.queryByText('https://testing-library.com')
    const likesEl = screen.queryByText('12')

    expect(titleEl).toBeDefined()
    expect(urlEl).toBeNull()
    expect(likesEl).toBeNull()
  })

  test('clicking the show button reveals the url and likes', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('show')
    await user.click(button)

    const urlEl = screen.getByText('https://testing-library.com')
    const likesEl = screen.findByText('12')

    expect(urlEl).toBeDefined()
    expect(likesEl).toBeDefined()
  })
})
