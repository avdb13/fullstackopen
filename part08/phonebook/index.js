require('dotenv').config()
const { ApolloServer } = require('@apollo/server')
const { expressMiddleware } = require('@apollo/server/express4')
const {
  ApolloServerPluginDrainHttpServer: drainHttpServer
} = require('@apollo/server/plugin/drainHttpServer')
const { makeExecutableSchema } = require('@graphql-tools/schema')
const { default: mongoose } = require('mongoose')
const typeDefs = require('./schema')
const resolvers = require('./resolvers')
const jwt = require('jsonwebtoken')
const express = require('express')
const cors = require('cors')
const http = require('http')
const User = require('./models/user')
const { useServer } = require('graphql-ws/lib/use/ws')
const { WebSocketServer } = require('ws')

const MONGODB_URI = process.env.MONGODB_URI
console.log(`connecting to ${MONGODB_URI}`)

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log('connected to MongoDB'))
  .catch((e) => console.log(`couldn't connect to MongoDB: ${e.message}`))

// mongoose.set('debug', true)

const start = async () => {
  const app = express()
  const httpServer = http.createServer(app)

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/'
  })

  const schema = makeExecutableSchema({ typeDefs, resolvers })
  const serverCleanUp = useServer({ schema }, wsServer)

  const server = new ApolloServer({
    schema,
    plugins: [drainHttpServer({ httpServer }), {
      async serverWillStart () {
        return {
          async drainServer () {
            await serverCleanUp.dispose()
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
          const decodedToken = jwt.verify(
            auth.substring('Bearer '.length),
            process.env.JWT_SECRET
          )
          const currentUser = await User.findById(decodedToken.id).populate(
            'friends'
          )

          return { currentUser }
        }
      }
    })
  )

  const PORT = 4000

  httpServer.listen(PORT, () => console.log(`HTTP server is running on port ${PORT}`))
}

start()
