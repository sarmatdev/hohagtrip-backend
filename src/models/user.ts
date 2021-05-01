import crypto from 'crypto'
import { NextFunction } from 'express'
import validator from 'validator'
import bcrypt from 'bcryptjs'
import { prop, pre, getModelForClass } from '@typegoose/typegoose'
import { instanceMethod } from 'typegoose'
import { Role, UserDocument } from '../interfaces/models/userDocument'

@pre<User>('save', async function (next: NextFunction): Promise<void> {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 12)
  this.passwordConfirm = undefined
  next()
})
@pre<User>('save', function (next: NextFunction): void {
  if (!this.isModified('password') || this.isNew) return next()
  this.passwordChangedAt = Date.now() - 1000
  next()
})
class User {
  @prop({ required: true })
  public firstName!: string

  @prop({ required: true })
  public lastName!: string

  @prop({
    required: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: 'Please provide your email'
    }
  })
  public email!: string

  @prop({ required: false })
  public image?: string

  @prop({ enum: Role, default: 'user' })
  public role?: string

  @prop({ required: [false, 'Please provide a password'], minlength: 8, select: false })
  public password?: string

  @prop({
    required: [false, 'Please confirm your password'],
    validate: function (el: string) {
      return el === this.password
    }
  })
  public passwordConfirm?: string

  @prop()
  public passwordChangedAt?: number

  @prop({ type: String })
  public passwordResetToken?: string

  @prop()
  public passwordResetExpires?: number

  @prop({ type: Boolean, default: true, select: false })
  public active?: boolean

  @instanceMethod async correctPassword(candidatePassword: string, userPassword: string): Promise<boolean> {
    return await bcrypt.compare(candidatePassword, userPassword)
  }

  @instanceMethod changedPasswordAfter(JWTTimestamp: number) {
    if (this.passwordChangedAt) {
      //eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10)

      return JWTTimestamp < changedTimestamp
    }

    return false
  }

  @instanceMethod createPasswordResetToken(): string {
    const resetToken = crypto.randomBytes(32).toString('hex')
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000
    return resetToken
  }
}

const UserModel = getModelForClass(User)
export default UserModel
