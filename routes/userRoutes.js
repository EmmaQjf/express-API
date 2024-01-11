//Router
//import the controller 
////The router's job is exactly that, to route the request to the requested controller/method while the controller will "control" and do the processing/generating response
//In a modern framework a router defines a direct connection between a "kind" of possible requests and its processor

const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController.js')


router.post('/', userController.createUser)
router.post('/login', userController.loginUser)
router.put('/:id', userController.updateUser)
router.delete('/:id', userController.auth, userController.deleteUser)

module.exports = router

