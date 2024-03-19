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
      minlength: 3,
      required: true      
    },
    phone: {
      type: String,
      validate: {
        validator: function(v) {
          return /^[0-9]{2,3}-[0-9]{6,}$/.test(v);
        },
        message : props => `${props.value} is not a valid phone number!`
      },
      required: [true, 'User phone number required']
    },
  })
  
  agendaSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

module.exports = mongoose.model('Contacto', agendaSchema)