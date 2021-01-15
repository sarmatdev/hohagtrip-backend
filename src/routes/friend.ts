import { Router } from 'express'
import { getFriends } from '../controllers/friend'

const router: Router = Router()

router.get('/', getFriends)

export default router
