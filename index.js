const express = require('express')
const app = express()
const morgan = require('morgan') 
const cors = require('cors')
require('dotenv').config()
const Person = require('./models/phonebook')

app.use(express.static('build'))
app.use(express.json())
app.use(cors())

morgan.token('person', (req) => {
    return req.method === 'POST'
    ? JSON.stringify(req.body)
    : null
})

app.use(morgan((tokens, req, res) => {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), "-",
        tokens['response-time'](req, res), 'ms',
        tokens.person(req, res), 
    ].join(' ')
}))

app.get('/api/persons', (req, res) => {
      Person.find({}).then(persons =>{
        res.json(persons)
      })
  })

app.get('/api/persons/info', (req, res) => {
    Person.find({}).then(persons =>{
        res.send(`<p>Phonebook has info for ${persons.length} people
        </p> ${new Date()}`)
    })
  })

app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id)
    .then(person => {
    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
    })
    .catch(error => next(error))
  })

  app.delete('/api/persons/:id', (req, res, next) => {
      Person.findByIdAndRemove(req.params.id)
      .then (result => {
          res.status(204).end()
      })
      .catch(error => next(error))
  })

  app.post('/api/persons', (req, res, next) => {
      const body = req.body
    
    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save()
    .then(savedPerson => {
        res.json(savedPerson)
    })
    .catch(error => next(error))
  })

  app.put('/api/persons/:id', (req, res, next) => {
      const body = req.body

      const person = {
          name: body.name,
          number: body.number
      }

      Person.findByIdAndUpdate(req.params.id, person, { new: true })
      .then(updatedPerson => {
          res.json(updatedPerson)
      })
      .catch(error => next(error))
  })

  const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
  app.use(unknownEndpoint)

  const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).send({ error: 'error.message'})
    }
  
    next(error)
  }

  app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  })