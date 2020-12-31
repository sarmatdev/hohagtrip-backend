import { Router } from 'express'
import { getAllHomes, getHome, createHome, updateHome, deleteHome } from '../controllers/home'

const router: Router = Router()

router.route('/').get(getAllHomes).post(createHome)
router.route('/:id').get(getHome).patch(updateHome).delete(deleteHome)

export default router
