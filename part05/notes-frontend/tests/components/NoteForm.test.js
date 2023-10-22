import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import NoteForm from '../../src/components/NoteForm'

describe('<Noteform />', () => {
  test('updates parent state and calls onSubmit', async () => {
    const createNote = jest.fn()
    const user = userEvent.setup()

    render(<NoteForm createNote={createNote} />)

    const input = screen.getByPlaceholderText('a new note ...')
    const sendButton = screen.getByText('save')

    await user.type(input, 'testing form')
    await user.click(sendButton)

    expect(createNote.mock.calls).toHaveLength(1)
    console.log(createNote.mock.calls)
    expect(createNote.mock.calls[0][0].content).toBe('testing form')
  })
})
