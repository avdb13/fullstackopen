import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from '../../src/components/Blog'

describe('<Blog />', () => {
  test('the component displaying a blog renders the blog\'s title and author', async () => {
    const blog = {
      title: 'testing article',
      url: 'https://testing-library.com',
      author: 'Kent C. Dodds',
      likes: 12
    }

    render(<Blog blog={blog} />)

    const titleEl = screen.getByText('testing article')
    const urlEl = screen.queryByText('https://testing-library.com')
    const likesEl = screen.queryByText('12')

    expect(titleEl).toBeDefined()
    expect(urlEl).toBeNull()
    expect(likesEl).toBeNull()
  })
})
