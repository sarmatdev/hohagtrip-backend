import { Router } from 'express'
import { getAllHomes } from '../controllers/home'

const router: Router = Router()

router.route('/').get(getAllHomes)

export default router
