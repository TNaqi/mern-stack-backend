const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')

const Schema = mongoose.Schema

const userSchema = new Schema({
  email: {
    type: String,
    require: true,
    unique: true
  },
  password: {
    type: String,
    require: true
  }
})

// static sign method 
userSchema.statics.signup = async function(email, password) {

  // validation
  if (!email || !password){
    throw Error('All fileds must be filled')
  }
  if (!validator.isEmail(email)){
    throw Error('Email not valid')
  }
  if (!validator.isStrongPassword(password)){
    throw Error('Password not strong enough')
  }

  const exists = await this.findOne({ email })
  if (exists) {
    throw Error('Email already in use')
  }

  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(password, salt)
  const user = await this.create({ email, password: hash })

  return user
}

// static login method 
userSchema.statics.login = async function(email, password) {

  // validation
  if (!email || !password){
    throw Error('All fileds must be filled')
  }

  const user = await this.findOne({ email })
  if (!user) {
    throw Error('incorrect Email')
  }

  const match = await bcrypt.compare(password, user.password)
  if (!match) {
    const hint = user.password.slice(-2)
    throw Error('incorrect password')
  }

  return user
}


module.exports = mongoose.model('User', userSchema)