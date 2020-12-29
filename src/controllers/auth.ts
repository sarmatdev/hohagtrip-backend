import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import User from '../models/user'
import catchAsync from '../utils/catchAsync'
import AppError from '../utils/appError'

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
    name: req.body.name,
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
