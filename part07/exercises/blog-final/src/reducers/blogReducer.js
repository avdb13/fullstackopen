import { useSelector } from 'react-redux'
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
    comment(state, action) {
      return state.map((b) =>
        b.id === action.payload.id
          ? { ...b, comments: [...b.comments, action.payload.comment] }
          : b,
      )
    },
  },
})

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll()
    console.log(blogs.map(blog => blog.comments))
    dispatch(set(blogs))
  }
}

export const createBlog = (blog) => {
  return async (dispatch, getState) => {
    let token = getState().user.token

    const newBlog = await blogService.create(blog, token)
    dispatch(append(newBlog))
  }
}

export const likeBlog = (blog) => {
  return async (dispatch, getState) => {
    let token = getState().user.token

    const newBlog = await blogService.update(
      {
        ...blog,
        likes: (blog.likes || 0) + 1,
      },
      token,
    )
    dispatch(update(newBlog))
  }
}

// clean this up later to only update the comment field
export const commentBlog = (blog, comment) => {
  return async (dispatch, getState) => {
    // const newBlog = await blogService.comment(id, comment)
    const newBlog = await blogService.update(
      {
        ...blog,
        comments: [...blog.comments, comment]
      },
    )
    dispatch(update(newBlog))
  }
}

export const removeBlog = (id) => {
  return async (dispatch, getState) => {
    let token = getState().user.token

    await blogService.remove(id, token)
    dispatch(remove(id))
  }
}

const { set, append, update, remove } = blogSlice.actions
export default blogSlice.reducer
