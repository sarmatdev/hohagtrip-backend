import { prop, getModelForClass } from '@typegoose/typegoose'

class Home {
  @prop({ required: true })
  public name!: string

  @prop({ required: true })
  public price!: number

  @prop({ required: true })
  public location!: string
}

const HomeModel = getModelForClass(Home)

export default HomeModel
