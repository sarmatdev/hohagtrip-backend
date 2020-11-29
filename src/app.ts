import express, { Application, Request, Response, NextFunction } from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

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

app.use(express.json())
app.use('/api/v1/users', userRouter);

const port = process.env.PORT || 3000
app.listen(process.env.PORT, () => {
  console.log(`🚀 Server is running on port ${port}`)
})
