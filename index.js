const express = require('express')
const app = express()
const bodyParser = require('body-parser')
app.use(bodyParser.json())

 let persons = [
    {
      "name": "Arto Hellas",
      "number": "040-123456",
      "id": 1
    },
    {
      "name": "Martti Tienari",
      "number": "040-123456",
      "id": 2
    },
    {
      "name": "Arto Järvinen",
      "number": "040-123456",
      "id": 3
    },
    {
      "name": "Lea Kutvonen",
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
  console.log('person to add', person)
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
console.log(persons.find(p => p.name === persons.name) === undefined)
  if(persons.find(p => p.name === persons.name) === undefined) {
    return response.status(400).json({
      error: 'name already in contacts'
    })
  }
  const randomID = Math.random() * 10000000000000000
  person.id = randomID
  persons = persons.concat(person)

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

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})