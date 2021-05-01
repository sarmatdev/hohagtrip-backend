import { Document } from 'mongoose'

export enum Role {
  USER = 'user',
  ADMIN = 'admin'
}

export interface UserDocument extends Document {
  email: string
  fisrtName: string
  lastName: string
  image: string
  googleId: string
  active: boolean
  role: Role
}
