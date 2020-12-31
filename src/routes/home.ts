import { Router } from 'express'
import { getAllHomes, getHome, createHome, updateHome } from '../controllers/home'

const router: Router = Router()

router.route('/').get(getAllHomes).post(createHome)
router.route('/:id').get(getHome).patch(updateHome)

export default router
