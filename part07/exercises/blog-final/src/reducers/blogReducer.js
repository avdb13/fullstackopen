import { onSuccess, onError } from './errorHandler'
import blogService from '../services/blogs'
import { createSlice } from '@reduxjs/toolkit'

const blogSlice = createSlice({
  name: 'blog',
  initialState: [],
  reducers: {
    set(state, action) {
      return action.payload
    },
    append(state, action) {
      return [...state, action.payload]
    },
    update(state, action) {
      return state.map((b) =>
        b.id === action.payload.id ? action.payload : b,
      )
    },
    remove(state, action) {
      return state.filter((b) => b.id !== action.payload)
    },
  },
})

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll()
    dispatch(set(blogs))
  }
}

export const createBlog = (blog) => {
  return async (dispatch, getState) => {
    let token = getState().user.token

    try {
      const newBlog = await blogService.create(blog, token)

      dispatch(append(newBlog))
      dispatch(
        onSuccess(`${newBlog.title} by ${newBlog.author} was added`)
      )
    } catch(e) {
      dispatch(onError(e, 'wrong credentials'))
    }
  }
}

export const likeBlog = (id, title) => {
  return async (dispatch, getState) => {
    // in case we want authentication
    // let token = getState().user.token

    const newBlog = await blogService.like(id)
    dispatch(update(newBlog))
    dispatch(onSuccess(`you liked ${title}`))
  }
}

export const commentBlog = (id, body) => {
  return async (dispatch, getState) => {
    const newBlog = await blogService.comment(id, body)
    dispatch(update(newBlog))
  }
}

export const removeBlog = (id) => {
  return async (dispatch, getState) => {
    let token = getState().user.token

    try {
      await blogService.remove(id, token)
      dispatch(remove(id))
    } catch(e) {
      dispatch(onError(e, e.response.data))
    }
  }
}

const { set, append, update, remove } = blogSlice.actions
export default blogSlice.reducer
