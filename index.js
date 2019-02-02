require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

app.use(bodyParser.json())
morgan.token('requestobject', (req, res) => {
  //console.log('päästiin tänne')
  const person = req.body
  //console.log(person)
  return (JSON.stringify(person))
})
//app.use(morgan('tiny'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :requestobject'))
app.use(cors())
app.use(express.static('build'))

const Contact = require('./models/contact')


//  let persons = [
//     {
//       "name": "Frodo Baggings",
//       "number": "040-123456",
//       "id": 1
//     },
//     {
//       "name": "Sawise Gangee",
//       "number": "040-123456",
//       "id": 2
//     },
//     {
//       "name": "Meriadoc Brandybuck",
//       "number": "040-123456",
//       "id": 3
//     },
//     {
//       "name": "Peregrin Took",
//       "number": "040-123456",
//       "id": 4
//     }
//   ]

app.get('/api', (req, res) => {
  res.send('<h1>Puhelinluettelo</h1>')
})

app.get('/api/persons', (req, res) => {
  console.log('pyydettiin persons')
  Contact.find({}).then(returnedPersons => {
    res.json(returnedPersons.map(person => person.toJSON()))
  })
})

app.post('/api/persons', (req, res) => {
  const person = req.body

  
  //console.log('person to add', person)
  //console.log('person name', person.name, ' person number', person.number)
  if(person.name === undefined || person.name === '') {
    return res.status(400).json({
      error: 'name missing'
    })
  }
  if(person.number === undefined || person.number === '') {
    return ReadableStream.status(400).json({
      error: 'number missing'
    })
  }

  const newPerson = new Contact({
    name: person.name,
    number: person.number
  })

  newPerson.save().then(savedPerson => {
    res.json(savedPerson.toJSON())
  })

  //console.log('persons sisältö ', persons)
  //let found = persons.find(p => p.name !== persons.name)
  //console.log('löytyy henkilö ', found)
  //console.log('löytyy jo luettelosta?',persons.find(p => p.name === persons.name) === undefined)
  // if(persons.find(p => p.name === persons.name) !== undefined) {
  //   return res.status(400).json({
  //     error: 'name already in contacts'
  //   })
  // }
  // //console.log('päästiin iffien läpi')
  // const randomID = Math.random() * 10000000000000000
  // person.id = randomID
  // persons = persons.concat(person)
  // //console.log('persons lopuksi',persons)
  // res.json(person)
})

app.get('/api/info', (req, res) => {
    let d = new Date()  
    res.send(`Puhelinluettelossa on ${persons.length} henkilön tiedot <br/> ${d}`)
  })

app.get('/api/persons/:id', (req, res, next) => {
  Contact.findById(req.params.id).then(person => {
    if(person) {
      res.json(person.toJSON())
    } else {
      res.status(404).end()
    }
  })
  .catch(error => next(error))

    // console.log('persons get id:', req.params.id)
    // const id = Number(req.params.id)
    // const person = persons.find(p => p.id === id)
    // if(person) {
    //     res.json(person)
    // } else {
    //     res.status(404).end()
    // }
    
})

app.delete('/api/persons/:id', (req, res, next) => {
    Contact.findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => next(error))
});

const errorHandler = (error, request, response, next) => {
  //console.log('PÄÄSTIIN ERROR HANDLERIIN')
  console.error(error.message)
  
  if (error.name === 'CastError' && error.kind == 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})