const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

if(process.argv.length === 5){
  const url =
    `mongodb+srv://moralesandres:${password}@cluster0.ladkblf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
  
  mongoose.set('strictQuery',false)
  mongoose.connect(url)
  
  const agendaSchema = new mongoose.Schema({
    name: String,
    phone: String,
  })
  
  const Contacto = mongoose.model('Contacto', agendaSchema)
  
  const contacto = new Contacto({
    name: process.argv[3],
    phone: process.argv[4],
  })
  
  contacto.save().then(result => {
    console.log(`added ${contacto.name} number ${contacto.phone} to phonebook`)
    mongoose.connection.close()
  })
}
else{
    const url =
    `mongodb+srv://moralesandres:${password}@cluster0.ladkblf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
  
  mongoose.set('strictQuery',false)
  mongoose.connect(url)
  
  const agendaSchema = new mongoose.Schema({
    name: String,
    phone: String,
  })
  
  const Contacto = mongoose.model('Contacto', agendaSchema)
  
  Contacto.find({}).then(result => {
    console.log('phonebook:')
    result.forEach(contacto => {
        console.log(contacto.name, contacto.phone)
    })
    mongoose.connection.close()
  })  
}

