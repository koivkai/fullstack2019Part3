if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
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

app.get('/api', (req, res) => {
  res.send('<h1>Puhelinluettelo</h1>')
})

app.get('/api/persons', (req, res) => {
  //console.log('pyydettiin persons')
  Contact.find({}).then(returnedPersons => {
    res.json(returnedPersons.map(person => person.toJSON()))
  })
})

app.post('/api/persons', (req, res, next) => {
  const person = req.body

  
  //console.log('person to add', person)
  //console.log('person name', person.name, ' person number', person.number)
  if(person.name === undefined || person.name === '') {
    return res.status(400).json({
      error: 'name missing'
    })
  }
  if(person.number === undefined || person.number === '') {
    return res.status(400).json({
      error: 'number missing'
    })
  }

  const newPerson = new Contact({
    name: person.name,
    number: person.number
  })

  newPerson.save()
  .then(savedPerson => {
    return savedPerson.toJSON()
  })
  .then((savedFormatedPerson) => {
    res.json(savedFormatedPerson)
  })
  .catch(error => next(error))
})

app.get('/api/info', (req, res) => {
    let d = new Date()  
    Contact.find({}).then(persons => {
      res.send(`Puhelinluettelossa on ${persons.length} henkilön tiedot <br/> ${d}`)
    })
   
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

app.put('/api/persons/:id', (req, res, next) => {
  const personToUpdate = req.body

  const person = {
    name: personToUpdate.name,
    number: personToUpdate.number,
  }

  Contact.findByIdAndUpdate(req.params.id, person, { new: true })
    .then(updatedPerson => {
      res.json(updatedPerson.toJSON())
    })
    .catch(error => next(error))
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
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({error: error.message})
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})