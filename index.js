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


 let persons = [
    {
      "name": "Frodo Baggings",
      "number": "040-123456",
      "id": 1
    },
    {
      "name": "Sawise Gangee",
      "number": "040-123456",
      "id": 2
    },
    {
      "name": "Meriadoc Brandybuck",
      "number": "040-123456",
      "id": 3
    },
    {
      "name": "Peregrin Took",
      "number": "040-123456",
      "id": 4
    }
  ]

app.get('/', (req, res) => {
  res.send('<h1>Puhelinluettelo</h1>')
})

app.get('/persons', (req, res) => {
  res.json(persons)
})

app.post('/persons', (request, response) => {
  const person = request.body
  //console.log('person to add', person)
  //console.log('person name', person.name, ' person number', person.number)
  if(person.name === undefined || person.name === '') {
    return response.status(400).json({
      error: 'name missing'
    })
  }
  if(person.number === undefined || person.number === '') {
    return response.status(400).json({
      error: 'number missing'
    })
  }
  //console.log('persons sisältö ', persons)
  let found = persons.find(p => p.name !== persons.name)
  //console.log('löytyy henkilö ', found)
  //console.log('löytyy jo luettelosta?',persons.find(p => p.name === persons.name) === undefined)
  if(persons.find(p => p.name === persons.name) !== undefined) {
    return response.status(400).json({
      error: 'name already in contacts'
    })
  }
  //console.log('päästiin iffien läpi')
  const randomID = Math.random() * 10000000000000000
  person.id = randomID
  persons = persons.concat(person)
  //console.log('persons lopuksi',persons)
  response.json(person)
})

app.get('/info', (req, res) => {
    let d = new Date()  
    res.send(`Puhelinluettelossa on ${persons.length} henkilön tiedot <br/> ${d}`)
  })

app.get('/persons/:id', (req, res) => {
    console.log('persons get id:', req.params.id)
    const id = Number(req.params.id)
    const person = persons.find(p => p.id === id)
    if(person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
    
})

app.delete('/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    person = persons.filter(p => p.id !== id); 
    response.status(204).end();
});

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})