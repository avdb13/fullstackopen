const mongoose = require('mongoose')
require('dotenv').config()

mongoose
  .connect(process.env.MONGODB_URI)
  .catch((e) => console.log(`something went wrong: ${e}}`))

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: {
    type: String,
    minLength: 8,
    validate: {
      validator: (s) => /\d{2,3}-\d{6,}/.test(s),
      message: (props) => `${props.value} is not a valid phone number`
    },
    required: [true, 'Phone number required']
  }
})

contactSchema.set('toJSON', {
  transform: (document, retObject) => {
    retObject.id = retObject._id.toString()
    delete retObject._id
    delete retObject.__v
  }
})

module.exports = mongoose.model('Contact', contactSchema)
