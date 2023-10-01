require('dotenv').config()
const bcrypt = require('bcrypt')
const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')
const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')
const { PubSub } = require('graphql-subscriptions')

const pubsub = new PubSub()

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, { author, genre }) => {
      genre = genre || '.*'

      const books = await Book.find({
        genres: { $elemMatch: { $regex: genre } }
      }).populate('author')
      return author ? books.filter((b) => b.author.name === author) : books
    },
    allAuthors: async () => Author.find({}),
    me: async (root, args, context) => {
      console.log(context.user)
      return context.user
    }
  },
  Author: {
    bookCount: async (root) => {
      return Author.findOne({}).then((author) => author.books.length)
    }
  },
  Mutation: {
    addBook: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new GraphQLError('Not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }

      // hack to insert new author if he doesn't exist
      const author = await Author.findOneAndUpdate(
        { name: args.author },
        {},
        { upsert: true, new: true, runValidators: true }
      ).catch((e) => {
        console.log(e)
        throw new GraphQLError('adding author for new book failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            e
          }
        })
      })

      // https://stackoverflow.com/questions/46770501/graphql-non-nullable-array-list
      if (args.genres.length === 0) {
        throw new GraphQLError('genres must be provided', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }

      const newBook = new Book({ ...args, author: author._id })
      author.books = [...author.books, newBook._id]

      try {
        await newBook.save()
        await author.save()
      } catch (e) {
        throw new GraphQLError('adding new book failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            e
          }
        })
      }

      pubsub.publish('BOOK_ADDED', { bookAdded: newBook.populate('author') })

      return newBook.populate('author')
    },
    editAuthor: async (root, { name, setBornTo }, { currentUser }) => {
      if (!currentUser) {
        throw new GraphQLError('Not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }
      return Author.findOneAndUpdate(
        { name },
        { born: setBornTo },
        { new: true, upsert: true }
      )
    },
    createUser: async (root, args) => {
      const password = await bcrypt.hash(args.password, 10)
      const user = new User({ ...args, password })

      return user.save().catch((e) => {
        throw new GraphQLError('creating new user failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            e
          }
        })
      })
    },
    login: async (root, { username, password }) => {
      const user = await User.findOne({ username })
      if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new GraphQLError('wrong credentials', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }

      const userForToken = {
        username,
        id: user._id
      }

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
    }
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator('BOOK_ADDED')
    }
  }
}

module.exports = { resolvers }
