import { Router } from 'express'
import { getAllHomes, getHome, createHome } from '../controllers/home'

const router: Router = Router()

router.route('/').get(getAllHomes).post(createHome)
router.route('/:id').get(getHome)

export default router
