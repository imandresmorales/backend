const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)

  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

  //3.19* Base de datos de la Agenda Telefónica, paso 7
  const agendaSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      minlength: 3
    },
    phone: String,
  })
  
  agendaSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

module.exports = mongoose.model('Contacto', agendaSchema)