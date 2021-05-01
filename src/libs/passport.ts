import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import User from '../models/user'
import passport from 'passport'

const passportConfig = (passport: passport): void => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: 'http://localhost:3000/api/v1/auth/google/callback'
      },
      async (_, __, profile, done) => {
        const newUser = {
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          googleId: profile.id,
          email: profile.emails[0].value,
          image: profile.photos[0].value
        }

        try {
          let user = await User.findOne({ googleId: profile.id })

          if (user) {
            return done(null, user)
          } else {
            user = await User.create(newUser)
            return done(null, user)
          }
        } catch (err) {
          console.error(err)
        }
      }
    )
  )

  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => done(err, user))
  })
}

export default passportConfig
