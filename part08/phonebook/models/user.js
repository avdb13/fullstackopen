const { default: mongoose, mongo } = require('mongoose')

const schema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 3,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  friends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Person'
    }
  ]
}, { collection: 'users' })

module.exports = mongoose.model('User', schema)
