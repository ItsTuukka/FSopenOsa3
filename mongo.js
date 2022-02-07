const mongoose = require('mongoose')

// eslint-disable-next-line no-undef
if (process.argv.length<3) {
    console.log('give password as argument')
    // eslint-disable-next-line no-undef
    process.exit(1)
}

// eslint-disable-next-line no-undef
const password = process.argv[2]

const url =
  `mongodb+srv://itsTuukka:${password}@cluster0.x1aui.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema)

// eslint-disable-next-line no-undef
if (process.argv.length === 3) {
    console.log('phonebook:')
    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(person.name, person.number)
        })
        mongoose.connection.close
        // eslint-disable-next-line no-undef
        process.exit(1)
    })
} else {
    const person = new Person({
        // eslint-disable-next-line no-undef
        name: process.argv[3],
        // eslint-disable-next-line no-undef
        number: process.argv[4]
    })

    person.save().then(() => {
        // eslint-disable-next-line no-undef
        console.log(`added ${process.argv[3]} number ${process.argv[4]} to phonebook`)
        mongoose.connection.close()
    })
}
