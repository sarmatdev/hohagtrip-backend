import { Router } from 'express'
import { signup, login, forgot, reset, updatePassword } from '../controllers/auth'

const router: Router = Router()

router.post('/signup', signup)
router.post('/login', login)
router.post('/forgot', forgot)
router.patch('/reset/:token', reset)
router.patch('/updatePassword/:id', updatePassword)

export default router
