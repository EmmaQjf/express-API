// the pacakages and variables needed for setup
const request = require('supertest') // test API: this is the thing that lets us run our code like postman
const mongoose = require('mongoose')
const{MongoMemoryServer} = require('mongodb-memory-server')// mongodb-memory-server has a lot of things, and we only need and want MongoMemoryServer; this creates the fake mongodb database that exists on our computer in our memory not on atlas

const app = require('../app')// this is our api application that we made with expresss. this is the thing that we are giving to supertest to test

const User = require('../models/user') //This is for use to be able to do crud operation on the User.

const server = app.listen(8081,() => console.log('Testing on Port 8081')) // turn the server off when we finish the test; use different port for each testing file 
//set a variable for mongoServer

let mongoServer // use it in two functions: afterAll and beforeAll

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create() // create a server, same as go to the mongoDBAtlas and create a cluster
    mongoose.connect(mongoServer.getUri(),{useNewUrlParser: true, useUnifiedTopology: true})
}) //before all the tests run, do something 

afterAll(async () => {
    await mongoose.connection.close() // same as ctrl+c; shut off mongoose connection with mongodb 
    mongoServer.stop() //shut off the database
    server.close() // shut off the application server
})

describe('Test suite for the /users routes on our api', () => {
      // /users create 

      test('it should create a new user in the db', async () => {
         const response = await request(app).post('/users').send({name: 'Jeremy Casanova', email: 'casanova@smooth.com',password: "12345"}) // send the request 

         expect(response.statusCode).toBe(200)
         expect(response.body.user.email).toEqual('casanova@smooth.com')
         expect(response.body.user.name).toEqual('Jeremy Casanova')
         expect(response.body).toHaveProperty('token')

      })



      // /users/login
    test('it should allow the user to log in', async () => {
        const user = {email: 'casanova@smooth.com',password: "12345"}
        const response = await request(app).post('/users/login').send(user)
        expect (response.status).toBe(200)
        expect(response.body.user.email).toEqual('casanova@smooth.com')
        expect(response.body.toHaveProperty)
    })

      // /users/:id update

    // test('it should update the user info', async () => {
    //     const user = new User({name: 'Jeremy Casanova', email: 'casanova@gmail.com',password: "123456789"})
    //     user.save()
    //     const response = await request(app).put(`/users/${user._id}`).set('Authorization',`Bearer ${token}`).send({name: 'Jeremy Casanova', email: 'casanova@gmail.com'})

    //     // expect(response.body.user.email).toEqual('casanova@gmail.com') // why there is no user 
    //     expect(response.body.user.email).toEqual('casanova@gmail.com')
    //     expect(response.body.user.name).toEqual('casanova@gmail.com')
    //     expect(response.status).toBe(200)
    //     // expect(response.body.user).toEqual({_id: "8888", email: 'casanova@gmail.com',password: "123456789"})

    // })

     // /users/login
    test('It should login a user', async () => {
        const user = new User({ name: 'John Doe', email: 'john.doe@example.com', password: 'password123' })
        await user.save()
    
        const response = await request(app)
          .post('/users/login')
          .send({ email: 'john.doe@example.com', password: 'password123' })
        
        expect(response.statusCode).toBe(200)
        expect(response.body.user.name).toEqual('John Doe')
        expect(response.body.user.email).toEqual('john.doe@example.com')
        expect(response.body).toHaveProperty('token')
      })
    // /users/:id update
      test('It should update a user', async () => {
        const user = new User({ name: 'John Doe', email: 'john.doe@example.com', password: 'password123' })
        await user.save()
        const token = await user.generateAuthToken()
    
        const response = await request(app)
          .put(`/users/${user._id}`)
          .set('Authorization', `Bearer ${token}`)
          .send({ name: 'Jane Doe', email: 'jane.doe@example.com' })
        
        expect(response.statusCode).toBe(200)
        expect(response.body.name).toEqual('Jane Doe')
        expect(response.body.email).toEqual('jane.doe@example.com')
      })
      // /user/:id delete
      test('It should delete a user', async () => {
        const user = new User({ name: 'John Doe', email: 'john.doe@example.com', password: 'password123' })
        await user.save()
        const token = await user.generateAuthToken()
    
        const response = await request(app)
          .delete(`/users/${user._id}`)
          .set('Authorization', `Bearer ${token}`)
        
        expect(response.statusCode).toBe(200)
        expect(response.body.message).toEqual('User deleted')
      })
    


})