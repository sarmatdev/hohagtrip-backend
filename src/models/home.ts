import { model, Schema, Model, Document } from 'mongoose'

interface IHome extends Document {
  name: string
  price: number
  location: string
}

const HomeSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'Please, set the home name']
  },
  price: {
    type: String,
    required: [true, 'Please, set the price']
  },
  location: {
    type: String,
    required: [true, 'Please, set the home location']
  }
})

const Home: Model<IHome> = model('Home', HomeSchema)

export default Home
