import crypto from 'crypto'
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

interface UserDocument extends IUser {
  passwordChangedAt?: number
  passwordResetToken?: string
  passwordResetExpires?: number
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
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date
})

UserSchema.pre<UserDocument>('save', async function (next: NextFunction) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 12)
  this.passwordConfirm = undefined
  next()
})

UserSchema.pre<UserDocument>('save', function (next: NextFunction): void {
  if (!this.isModified('password') || this.isNew) return next()
  this.passwordChangedAt = Date.now() - 1000
  next()
})

UserSchema.methods.correctPassword = async function (candidatePassword: string, userPassword: string) {
  return await bcrypt.compare(candidatePassword, userPassword)
}

UserSchema.methods.changedPasswordAfter = function (ctx: UserDocument, JWTTimestamp) {
  if (ctx.passwordChangedAt) {
    //eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const changedTimestamp = parseInt(ctx.passwordChangedAt.getTime() / 1000, 10)

    return JWTTimestamp < changedTimestamp
  }

  return false
}

UserSchema.methods.createPasswordResetToken = function (ctx: UserDocument): string {
  const resetToken = crypto.randomBytes(32).toString('hex')

  ctx.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')
  ctx.passwordResetExpires = Date.now() + 10 * 60 * 1000

  return resetToken
}

const User: Model<UserDocument> = model<UserDocument>('User', UserSchema)

export default User
