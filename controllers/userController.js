
// req.header('Authorization').replace

//auth code's purpose 
// keep the user logged in by verify their identity and move from page to page instead of asking them to log in every time 
//everytime you log in, you get a new token 


//token ---encoded version of the user data
//const token = req.header('Authorization').replace('Bearer ', '') -- romove the bearer
// token is saved in the state(front-end)? or local storage(back-end)

//const data = jwt.verify(token, 'secret')
//use the secret to verify the token match the signature , unencoded it and save the payload in the variable called data 


//exports.auth is based on the user already logged in
//req.header('Authorization')-- bearerToken 


const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


//req.header('Authorization') to get the token and store it in the variable 
exports.auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '')
    const data = jwt.verify(token, 'secret')
    const user = await User.findOne({ _id: data._id })
    if (!user) {
      throw new Error()
    }
    req.user = user
    next()
  } catch (error) {
    res.status(401).send('Not authorized')
  }
}

exports.createUser = async (req, res) => {
  try{
    const user = new User(req.body)
    await user.save() // use save function before in the database model it requires to call the before save function to encrypt the password 
    const token = await user.generateAuthToken()
    res.status(200).json({ user, token }) // status(200) is the default 
  } catch(error){
    res.status(400).json({message: error.message})
  }
}
//login to get the token , verify the user 
exports.loginUser = async (req, res) => {
  try{
    const user = await User.findOne({ email: req.body.email })
    if (!user || !await bcrypt.compare(req.body.password, user.password)) {
      res.status(400).send('Invalid login credentials')
    } else {
      const token = await user.generateAuthToken()// what is the point of this 
      res.json({ user, token })
    }
  } catch(error){
    res.status(400).json({message: error.message})
  }
}

exports.updateUser = async (req, res) => {
  try{
    const updates = Object.keys(req.body) //Object.keys() static method returns an array of a given object's own enumerable string-keyed property names.
    const user = await User.findOne({ _id: req.params.id })
    updates.forEach(update => user[update] = req.body[update])
    await user.save()
    res.json(user)
  }catch(error){
    res.status(400).json({message: error.message})
  }
  
}

exports.deleteUser = async (req, res) => {
  try{
    await req.user.deleteOne()
    res.json({ message: 'User deleted' })
  }catch(error){
    res.status(400).json({message: error.message})
  }
}
//add the keys to the exports object 
// module.exports == app, override the module.exports 


// to delete, login first to verify the user (authenzisation)and get the token 