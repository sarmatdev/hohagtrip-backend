import { model, Schema, Model, Document } from 'mongoose'
import { NextFunction } from 'express'
import validator from 'validator'
import bcrypt from 'bcryptjs'

interface IUser extends Document {
  name: string
  email: string
  password: string
  passwordConfirm: string
}

const UserSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name!']
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    validate: [validator.isEmail, 'Please provide a valid email'],
    unique: true,
    lowercase: true
  },
  role: {
    type: String,
    enum: ['user', 'host', 'admin'],
    default: 'user'
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: function (el: string) {
      return el === this.password
    }
  }
})

UserSchema.pre<IUser>('save', async function (next: NextFunction) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 12)
  this.passwordConfirm = undefined
  next()
})

UserSchema.methods.correctPassword = async function (candidatePassword: string, userPassword: string) {
  return await bcrypt.compare(candidatePassword, userPassword)
}

const User: Model<IUser> = model('User', UserSchema)

export default User
