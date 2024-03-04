const express = require('express')
const app = express()
app.use(express.json())
app.use(express.static('dist'))

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

const cors = require('cors')

app.use(cors())

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}
app.use(requestLogger)

app.get('/', (req, res) => {
  res.redirect('/api/persons');
})

app.get('/api/persons',(request, response) => {
    response.json(persons)
  })

app.get('/api/persons/:id',(request, response) => {
    const id = Number(request.params.id)
    const person = persons.find( person => person.id === (id))
    if(person){
        response.json(person)
    }else{
        response.status(404).end()
    }
 })

app.get('/info', (request, response) => {
    response.send(
        `<p>
            Phonebook has info of ${persons.length} people 
            <br/>
            ${new Date()}
        </p>`
    )
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const body = request.body
  if(body.name === undefined || body.name === ""){
    response.send(
      `<p> error: the name has not been defined or does not exist </p>`
    )
    return response.status(400).end()
  }
  if(body.number === undefined || body.number === ""){
    response.send(
      `<p> error: the number has not been defined or does not exist </p>`
    )
    return response.status(400).end()
  }
  let persona = persons.filter(person => person.name === body.name)
  if(persona.name === undefined){
    response.send(
      `<p> error: 'name must be unique' </p>`
    )
    return response.status(400).end()
  }
  const id = persons.length >0 
    ? Math.max(...persons.map( person => person.id)) +1
    : 0
  const person ={
    "id": id,
    "name": body.name,
    "number": body.number
  }
  persons = persons.concat(person)
  response.json(person)
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})