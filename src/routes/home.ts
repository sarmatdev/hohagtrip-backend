import { Router } from 'express'
import { getAllHomes, getHome } from '../controllers/home'

const router: Router = Router()

router.route('/').get(getAllHomes)
router.route('/:id').get(getHome)

export default router
