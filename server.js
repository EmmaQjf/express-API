//connect to the mongoose , mongoDB and server -listen to to request 
require('dotenv').config() //to access the data in .env; load environment variables from your .envfile. In your server.jsfile:

const app = require('./app')
const mongoose = require('mongoose')
const PORT = process.env.PORT || 3000

mongoose.connect(process.env.MONGO_URI)
mongoose.connection.once('open', () => console.log('Mongo is showing love'))

app.listen(PORT, () => {
    console.log(`We in the building ${PORT}`)
})
//make it/app listen to the request, turn the server on 
