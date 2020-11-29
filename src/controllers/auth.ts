import { Request, Response, NextFunction } from 'express'
import User from '../models/user'

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
}
