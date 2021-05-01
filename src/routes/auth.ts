import { Router } from 'express'
import { Request, Response } from 'express'
import { googleAuth } from '../controllers/auth'
import User from '../models/user'
import passport from 'passport'

const router: Router = Router()

router.get('/google', passport.authenticate('google', { session: false, scope: ['openid', 'profile', 'email'] }))

router.get('/google/callback', passport.authenticate('google'), googleAuth, (req: Request, res: Response) => {
  res.send('you reached the redirect URI')
})

export default router
