import express, { Application, Request, Response, NextFunction } from 'express'
import dotenv from 'dotenv'

dotenv.config({path: './.env'})

const app: Application = express()

app.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.send('hello')
})

const port = process.env.PORT || 3000
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${port} 🚀`)
})