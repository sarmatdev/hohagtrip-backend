import express, { Application, Request, Response, NextFunction } from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

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

app.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.send('hello')
})

const port = process.env.PORT || 3000
app.listen(process.env.PORT, () => {
  console.log(`🚀 Server is running on port ${port}`)
})
