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

export const getHome = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const home = await Home.findById(req.params.id)

  if (!home) {
    return next(new AppError('No home found by this ID', 404))
  }

  res.status(200).json({
    status: 'success',
    data: {
      home
    }
  })
})

export const createHome = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const newHome = await Home.create(req.body)

  res.status(201).json({
    status: 'success',
    data: {
      newHome
    }
  })
})
