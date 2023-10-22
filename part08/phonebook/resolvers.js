const { GraphQLError } = require('graphql')
const bcrypt = require('bcrypt')
const { PubSub } = require('graphql-subscriptions')
const { v1: uuid } = require('uuid')
const Person = require('./models/person')
const User = require('./models/user')
const jwt = require('jsonwebtoken')

const pubsub = new PubSub()

const resolvers = {
  Person: {
    address: async (root) => {
      return {
        street: root.street,
        city: root.city
      }
    }
  },
  Query: {
    personCount: async () => Person.collection.countDocuments(),
    allPersons: async (root, args) => {
      if (!args.phone || args.phone === 'NO') {
        return Person.find({}).populate('friendOf')
      }
      return Person.find({ phone: { $exists: true } }).populate('friendOf')
    },
    findPerson: async (root, args) => Person.findOne({ name: args.name }),
    me: async (root, args, context) => context.currentUser
  },
  Mutation: {
    addPerson: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new GraphQLError('Not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }

      const person = new Person({ ...args })
      try {
        await person.save()

        currentUser.friends = [...currentUser.friends, person]

        await currentUser.save()
      } catch (e) {
        throw new GraphQLError(e.message, {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }

      pubsub.publish('PERSON_ADDED', { personAdded: person })

      return person
    },
    editNumber: async (root, { name, phone }) => {
      return Person.findOneAndUpdate({ name }, { phone }, { new: true })
    },
    createUser: async (root, { username, password }) => {
      const saltRounds = 10
      const hash = await bcrypt.hash(password, saltRounds)
      const user = new User({ username, password: hash })

      return user.save().catch((e) => {
        throw new GraphQLError('creating user failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            error: e.message
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
    },
    addAsFriend: async (root, { name }, { currentUser }) => {
      if (!currentUser) {
        throw new GraphQLError('Not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }

      const friend = await Person.findOne({ name })
      const isFriend = (f) => f._id.toString() === friend._id.toString()

      if (!currentUser.friends.find(isFriend)) {
        currentUser.friends = [...currentUser.friends, friend]
      }
      await currentUser.save()

      return currentUser
    }
  },
  Subscription: {
    personAdded: {
      subscribe: () => pubsub.asyncIterator('PERSON_ADDED')
    }
  }
}

module.exports = resolvers
