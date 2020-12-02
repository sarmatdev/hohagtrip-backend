import { Request, Response, NextFunction } from 'express'
import catchAsync from '../utils/catchAsync'
import User from '../models/user'

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
