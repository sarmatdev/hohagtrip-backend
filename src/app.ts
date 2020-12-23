import express, { Application, Request, Response, NextFunction } from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import morgan from 'morgan'

import userRouter from './routes/user'

dotenv.config({ path: './.env' })

mongoose
  .connect(`${process.env.DATABASE}`, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => console.log('✅ DB connection successful!'))
  .catch(() => console.log('❌ DB connection error!'))

const app: Application = express()

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

app.use(express.json())
app.use('/api/v1/users', userRouter)

app.get('/ping', (req: Request, res: Response) => {
  res.status(200).send('pong')
})

const port = process.env.PORT || 3000
app.listen(process.env.PORT, () => {
  console.log(`🚀 Server is running on port ${port}`)
})
