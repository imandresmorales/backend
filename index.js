const express = require('express')
const app = express()
app.use(express.json())
app.use(express.static('dist'))
require('dotenv').config()
const Person = require('./models/person')

let persons = [
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

const errorHandler = (err, req, resp, next) => {
  console.error(err.message)

  if (err.name === 'CastError') {
    return resp.status(400).send({ error: 'malformatted id' })
  } 

  next(err)
}

app.use(requestLogger)

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
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

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
  .then( result => {
    res.status(204).end()
  })
  .catch(error => next(error))
})

app.post('/api/persons', (request, response) => {
  const body = request.body
  
  if (body.phone === undefined) {
    return response.status(400).json({ error: 'phone missing' })
  }

  const person = new Person({
    name: body.name,
    phone: body.phone,
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    phone: body.phone,
  }

  Person.findByIdAndUpdate(request.params.id, person, { new:true})
  .then(updatePerson => {
    response.json(updatePerson)
  })
  .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})