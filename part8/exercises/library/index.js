require('dotenv').config()
const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const {
  ApolloServerPluginDrainHttpServer: drainHttpServer
} = require('@apollo/server/plugin/drainHttpServer')
const { useServer } = require('graphql-ws/lib/use/ws')
const { makeExecutableSchema } = require('@graphql-tools/schema')
const { expressMiddleware } = require('@apollo/server/express4')
const User = require('./models/user')
const { default: mongoose } = require('mongoose')
const express = require('express')
const http = require('http')
const jwt = require('jsonwebtoken')
const cors = require('cors')
const { typeDefs } = require('./schema')
const { resolvers } = require('./resolvers')
const { WebSocketServer } = require('ws')

const MONGODB_URI = process.env.MONGODB_URI

mongoose
  .connect(MONGODB_URI, { serverSelectionTimeoutMS: 0, connectTimeoutMS: 0 })
  .then(console.log(`MongoDB connected to ${MONGODB_URI}`))
  .catch((e) => console.log(`couldn't connect MongoDB: ${e}'`))

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

const start = async () => {
  const app = express()
  const httpServer = http.createServer(app)

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/'
  })

  const schema = makeExecutableSchema({ typeDefs, resolvers })
  const serverCleanup = useServer({ schema }, wsServer)

  const server = new ApolloServer({
    schema,
    plugins: [drainHttpServer({ httpServer }), {
      async serverWillStart () {
        return {
          async drainServer () {
            await serverCleanup.dispose()
          }
        }
      }
    }]
  })

  await server.start()

  app.use(
    '/',
    cors(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        const auth = req ? req.headers.authorization : null
        if (auth && auth.startsWith('Bearer ')) {
          const token = jwt.verify(
            auth.substring('Bearer '.length),
            process.env.JWT_SECRET
          )
          return User.findById(token.id)
        }
      }
    })
  )

  const PORT = 4000

  httpServer.listen(PORT, () => console.log(`listening on ${PORT}`))
}

start()
