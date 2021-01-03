import User from '../models/user'
import catchAsync from '../utils/catchAsync'
import AppError from '../utils/appError'
import { Request, Response, NextFunction } from 'express'

const filterObj = (obj, ...allowedFields) => {
  const newObj = {}
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el]
  })
  return newObj
}

export const update = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError('This route is not for password update! Please, use instead the /updatePassword endpoint!', 400)
    )
  }

  const filteredBody = filterObj(req.body, 'name', 'email')

  const user = await User.findByIdAndUpdate(req.params.id, filteredBody, {
    new: true,
    runValidators: true
  })

  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  })
})
