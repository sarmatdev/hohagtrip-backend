import { Router } from 'express'
import { signup, login, forgot, reset, updatePassword, protect } from '../controllers/auth'
import { updateMe, deleteMe, getMe } from '../controllers/user'

const router: Router = Router()

router.post('/signup', signup)
router.post('/login', login)
router.post('/forgot', forgot)
router.patch('/reset/:token', reset)
router.patch('/updatePassword/:id', protect, updatePassword)
router.patch('/update/:id', protect, updateMe)
router.delete('/delete/:id', protect, deleteMe)
router.get('/me', getMe)

export default router
