
const express = require('express')
const morgan = require('morgan')
const userRoutes = require ('./routes/userRoutes')
const app = express()

app.use(express.json()) //converting a JSON string to a JSON object for data manipulation
app.use(morgan('combined'))
app.use('/users', userRoutes)
//to seperate it from the server.js. test application work 

module.exports = app