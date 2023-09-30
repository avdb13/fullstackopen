require('dotenv').config()
const { v1: uuid } = require('uuid')
const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const Book = require('./models/book')
const Author = require('./models/author')
const { default: mongoose } = require('mongoose')
const { GraphQLError } = require('graphql')

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

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(
      author: String
      genre: String
    ): [Book]
    allAuthors: [Author]
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
  }
`

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, { author, genre }) => {
      genre = genre || '.*'

      const books = await Book.find({ genres: { $elemMatch: { $regex: genre } } }).populate('author')
      return author ? (books.filter(b => b.author.name === author)) : books
    },
    allAuthors: async () => Author.find({})
  },
  Author: {
    bookCount: async (root) => {
      return Author.find({}).then(authors => authors.map(a => a.books.length))
    }
  },
  Mutation: {
    addBook: async (root, args) => {
      try {
        await Author.validate({ name: args.author })
      } catch (e) {
        throw new GraphQLError('adding author for new book failed', {
          extensions: {
            code: 'BAD_USER_INPUT', e
          }
        })
      }

      // hack to insert new author if he doesn't exist
      const author = await Author.findOneAndUpdate({ name: args.author }, {}, { upsert: true, new: true })

      const newBook = new Book({ ...args, author: author._id })
      author.books = [...author.books, newBook._id]

      try {
        await newBook.save()
        await author.save()
      } catch (e) {
        throw new GraphQLError('adding new book failed', {
          extensions: {
            code: 'BAD_USER_INPUT', e
          }
        })
      }

      return newBook
    },
    editAuthor: async (root, { name, setBornTo }) => {
      return Author.findOneAndUpdate({ name }, { born: setBornTo }, { new: true, upsert: true })
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers
})

startStandaloneServer(server, {
  listen: { port: 4000 }
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
