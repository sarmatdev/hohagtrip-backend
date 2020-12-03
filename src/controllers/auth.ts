import { Request, Response, NextFunction } from 'express'
import User from '../models/user'
import catchAsync from '../utils/catchAsync'
import AppError from '../utils/appError'

export const signup = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm
  })

  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  })

  next()
})

export const login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body

  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400))
  }

  const user = await User.findOne({ email }).select('+password')

  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  })

  next()
})
