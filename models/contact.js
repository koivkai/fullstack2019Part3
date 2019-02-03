const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator');
mongoose.set('useFindAndModify', false)

const url = process.env.MONGODB_URI

console.log('commecting to', url)

mongoose.connect(url, { useNewUrlParser: true })
.then(result => {
    console.log('succesfully conntected to MongoDB')
})
.catch((error) => {
    console.log('Error encountered when connectiong to MongoDB: ',error.message)
})

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        required: true,
        unique: true
    },
    number: {
        type: Number,
        minlength: 8
    }
})
contactSchema.plugin(uniqueValidator)

contactSchema.set('toJSON', {
  transform: (decument, returndObject) => {
    returndObject.id = returndObject._id.toString()
    delete returndObject._id
    delete returndObject.__v
  }
})

module.exports = mongoose.model('Contact', contactSchema)