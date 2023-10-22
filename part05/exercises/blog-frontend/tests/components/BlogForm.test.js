import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from '../../src/components/BlogForm'

describe('<BlogForm /> : calling event handlers', () => {
  let container
  let createBlog

  beforeEach(() => {
    createBlog = jest.fn()
    container = render(<BlogForm createBlog={createBlog} />).container
  })

  test('when the event handler is called, the right details get passed',
    async () => {
      const blog = {
        title: 'testing article',
        url: 'https://testing-library.com',
        author: 'Kent C. Dodds',
      }

      const button = screen.getByText('create')
      for (let input in blog) {
        await userEvent.type(screen.getByPlaceholderText(input), blog[input])
      }
      await userEvent.click(button)

      expect(createBlog.mock.calls).toHaveLength(1)
      console.log(createBlog.mock.calls[0][0])
      expect(createBlog.mock.calls[0][0]).toEqual(blog)
    })
})
