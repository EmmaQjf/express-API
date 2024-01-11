// build the model 

const mongoose = require('mongoose')
const bcrypt = require('bcrypt') //incript our password
const jwt = require('jsonwebtoken') // do authentication work
//jwt has 3 objects-3 pieces
// header: JWT, alg to enscript the data 
// payload: data you will see; uer log in data 
// signature: enscripted/hashed version of the data  (use SHA256)
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
})

//pre --before you allow some action happen, do this.
//save--update/create user, save it to the database; The save() function is used to save the document to the database.
//this -- instance of the user information 
//save is the event for mongoose 

//everytime the user does (pre changes it to before)the action the save, do the function async

userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
      this.password = await bcrypt.hash(this.password, 8)
    }
    next()
  })

  //make a method for the class so all the instances of userSchema can call the function 
userSchema.methods.generateAuthToken = async function() {
    const token = jwt.sign({ _id: this._id }, 'secret')
    return token
}

  // create a instance of user,how to name the pamameter before userSchema --a table/collection
const User = mongoose.model('User', userSchema)

module.exports = User