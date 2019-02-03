const mongoose = require('mongoose')
mongoose.set('useFindAndModify', false)

if ( process.argv.length<3 ) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const newName = process.argv[3]
const newNumber = process.argv[4]

//console.log('newName ', newName, ' newNumber ', newNumber)

const url =
  `mongodb://koivkai:${password}@ds119445.mlab.com:19445/fullstackpersonsdb`

mongoose.connect(url, { useNewUrlParser: true })

const contactSchema = new mongoose.Schema({
  name: String,
  number: Number,
})

const Contact = mongoose.model('Contact', contactSchema)


if(newName === undefined || newNumber === undefined) {
    Contact.find({}).then(result => {
        result.forEach(p => {
          //console.log(p)
          console.log(`${p.name} ${p.number}`)
        })
        mongoose.connection.close()
      })
} else {
    const contact = new Contact({
        name: newName,
        number: newNumber 
      })
     
      contact.save().then(response => {
        console.log(`lisättiin henkilö ${newName} luetteloon numerolla ${newNumber}`)
        mongoose.connection.close();
      })
}


