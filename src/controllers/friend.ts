import { Request, Response, NextFunction } from 'express'
import fs from 'fs'

export const getFriends = (req: Request, res: Response, next: NextFunction) => {
  try {
    const jsonString: any = fs.readFileSync('./src/db.json')
    const data = JSON.parse(jsonString)
    res.status(200).json({
      status: 'success',
      data
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({
      status: 'fail'
    })
    return
  }

  next()
}
