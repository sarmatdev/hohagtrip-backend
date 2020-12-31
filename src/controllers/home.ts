import Home from '../models/home'
import catchAsync from '../utils/catchAsync'
import AppError from '../utils/appError'
import { Request, Response, NextFunction } from 'express'

export const getAllHomes = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const homes = await Home.find()

  res.status(200).json({
    status: 'success',
    data: {
      homes
    }
  })
})
