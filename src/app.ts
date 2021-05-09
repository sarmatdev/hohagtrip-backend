import express, { Application, Request, Response } from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import morgan from 'morgan'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import mongoSanitize from 'express-mongo-sanitize'
import xss from 'xss-clean'
import hpp from 'hpp'

import authRouter from './routes/auth'
import userRouter from './routes/user'
import homeRouter from './routes/home'

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

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!'
})

app.use('/api', limiter)
app.use(mongoSanitize())
app.use(xss())
app.use(hpp())
app.use(helmet())
app.use(cors())
app.use(express.json({ limit: '10kb' }))

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/homes', homeRouter)

app.options('*', cors())

app.get('/ping', (req: Request, res: Response) => {
  res.status(200).send('pong')
})

const port = process.env.PORT || 3000
app.listen(process.env.PORT, () => {
  console.log(`🚀 Server is running on port ${port}`)
})
