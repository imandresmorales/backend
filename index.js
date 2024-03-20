const express = require('express')
const app = express()
require('dotenv').config()
const Person = require('./models/person')

app.use(express.static('dist'))

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
  } else if(err.name === 'ValidationError'){
    return resp.status(400).json({ error: err.message })
  }
  next(err)
}

const cors = require('cors')

app.use(cors())
app.use(express.json())
app.use(requestLogger)

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/persons/:id',(request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.get('/info', (request, response) => {
  Person.countDocuments({}).then(count => {
    response.send(
      `<p>
          Phonebook has info of ${count} people 
          <br/>
          ${new Date()}
      </p>`
    )
  })
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then( () => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (body.phone === undefined) {
    return response.status(400).json({ error: 'phone missing' })
  }

  const person = new Person({
    name: body.name,
    phone: body.phone,
  })

  person.save()
    .then(savedPerson => {
      response.json(savedPerson)
    }).catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, phone } = request.body

  Person.findByIdAndUpdate(
    request.params.id,
    { name, phone },
    { new:true, runValidators: true, context: 'query' })
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