require('dotenv').config()
const bcrypt = require('bcrypt')
const { v1: uuid } = require('uuid')
const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')
const { default: mongoose } = require('mongoose')
const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')

const MONGODB_URI = process.env.MONGODB_URI

mongoose
  .connect(MONGODB_URI, { serverSelectionTimeoutMS: 0, connectTimeoutMS: 0 })
  .then(console.log(`MongoDB connected to ${MONGODB_URI}`))
  .catch((e) => console.log(`couldn't connect MongoDB: ${e}'`))

const typeDefs = `
  type Book {
    title: String!
    published: Int!
    author: Author!
    id: ID!
    genres: [String]!
  }

  type Author {
    name: String!
    id: ID!
    born: Int
    bookCount: Int
  }

  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(
      author: String
      genre: String
    ): [Book]
    allAuthors: [Author]
    me: User
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String]!
    ): Book
    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author
    createUser(
      username: String!
      favoriteGenre: String!
      password: String!
    ): User
    login(
      username: String!
      password: String!
    ): Token
  }
`

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
      return context.currentUser
    }
  },
  Author: {
    bookCount: async (root) => {
      return Author.find({}).then((authors) =>
        authors.map((a) => a.books.length)
      )
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
        throw new GraphQLError('adding author for new book failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            e
          }
        })
      })

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

      return newBook
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
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers
})

startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req, resp }) => {
    const auth = req ? req.headers.authorization : null

    if (!auth || !auth.startsWith('Bearer ')) {
      return null
    }

    const token = jwt.verify(
      auth.substring('Bearer '.length),
      process.env.JWT_SECRET
    )
    const currentUser = await User.findById(token.id)

    return { currentUser }
  }
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
