const express = require('express')
const app = express()
const morgan = require('morgan') 
const cors = require('cors')

morgan.token('person', (req) => {
    return req.method === 'POST'
    ? JSON.stringify(req.body)
    : null
})

app.use(express.json())
app.use(cors())
app.use(express.static('build'))
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

let persons = [
    { id: 1, name: 'Arto Hellas', number: '040-123456' },
    { id: 2, name: 'Ada Lovelace', number: '39-44-5323523' },
    { id: 3, name: 'Dan Abramov', number: '12-43-234345' },
    { id: 4, name: 'Mary Poppendieck', number: '39-23-6423122' }
  ]

  app.get('/api/persons', (req, res) => {
      res.json(persons)
  })

  app.get('/api/info', (req, res) => {
      res.send(`<p>Phonebook has info for ${persons.length} people
      </p> ${new Date()}`)
  })

  app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    console.log(id)
    const person = persons.find(person => person.id === id)

    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
  })

  app.delete('/api/persons/:id', (req, res) => {
      const id = Number(req.params.id)
      persons = persons.filter(person => person.id !== id)

      res.status(204).end()
  })

  app.post('/api/persons', (req, res) => {
      const body = req.body
      const names = persons.map(person => person.name)

      if (!body.name) {
          return res.status(400).json({
              error: 'name missing'
          })
      } if (!body.number) {
        return res.status(400).json({
            error: 'number missing'
        })
    } if (names.indexOf(body.name) !== -1) {
        return res.status(400).json({
            error: 'name must be unique'
        })
    }
    
    const person = {
        id: generateId(),
        name: body.name,
        number: body.number
    }

    persons = persons.concat(person)
    res.json(person)
  })

  const generateId = () =>{
      return Math.floor(Math.random()*1000000)
  }

  const PORT = process.env.PORT || 3001
  app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
  })