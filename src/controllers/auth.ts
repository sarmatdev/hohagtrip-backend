import crypto from 'crypto'
import { promisify } from 'util'
import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import User from '../models/user'
import catchAsync from '../utils/catchAsync'
import AppError from '../utils/appError'
import sendEmail from '../utils/email'

const signToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  })
}

const createSendToken = (user, statusCode: number, res: Response) => {
  const token = signToken(user._id)

  user.password = undefined
  user.passwordConfirm = undefined

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  })
}

export const signup = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const user = await User.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm
  })

  createSendToken(user, 201, res)
})

export const login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body

  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400))
  }

  const user = await User.findOne({ email }).select('+password')

  if (!user || !(await user.schema.methods.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password!', 401))
  }

  const token = signToken(user._id)

  user.password = undefined

  res.status(200).json({
    status: 'success',
    token,
    data: {
      user
    }
  })

  next()
})

export const forgot = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const user = await User.findOne({ email: req.body.email })
  if (!user) {
    return next(new AppError('There is no user with email address.', 404))
  }

  const resetToken = user.schema.methods.createPasswordResetToken(user)
  await user.save({ validateBeforeSave: false })

  const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 min)',
      message
    })

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!'
    })
  } catch (err) {
    user.passwordResetToken = undefined
    user.passwordResetExpires = undefined
    await user.save({ validateBeforeSave: false })

    return next(new AppError('There was an error sending the email. Try again later!', 500))
  }
})

export const reset = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex')

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  })

  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400))
  }
  user.password = req.body.password
  user.passwordConfirm = req.body.passwordConfirm
  user.passwordResetToken = undefined
  user.passwordResetExpires = undefined
  await user.save()

  createSendToken(user, 200, res)
})

export const updatePassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const user = await User.findById(req.params.id).select('+password')

  if (!user.schema.methods.correctPassword(req.body.passwordCurrent, user.password)) {
    return next(new AppError('Your current password is wrong!', 400))
  }

  user.password = req.body.password
  user.passwordConfirm = req.body.passwordConfirm
  await user.save()

  createSendToken(user, 200, res)
})

export const protect = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  let token: string

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]
  }

  if (!token) {
    return next(new AppError('You are not logged in! Please log in to get access.', 401))
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)

  const currentUser = await User.findById(decoded.id)
  if (!currentUser) {
    return next(new AppError('The user belonging to this token does no longer exist.', 401))
  }

  if (currentUser.schema.methods.changedPasswordAfter(currentUser, decoded.iat)) {
    return next(new AppError('User recently changed password! Please log in again.', 401))
  }

  //eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  req.user = currentUser
  next()
})
