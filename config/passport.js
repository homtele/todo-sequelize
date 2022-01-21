const bcrypt = require('bcryptjs')
const passport = require('passport')

const LocalStrategy = require('passport-local').Strategy
const GoogleStrategy = require('passport-google-oauth20').Strategy
const { User } = require('../models')

module.exports = app => {
  app.use(passport.session())
  app.use(passport.initialize())
  passport.use(new LocalStrategy({ usernameField: 'email', passReqToCallback: true }, async (req, email, password, done) => {
    try {
      const user = await User.findOne({ where: { email } })
      if (!user) {
        done(null, false, { message: 'That email is not registered!' })
        return
      }
      if (!bcrypt.compareSync(password, user.password)) {
        done(null, false, { message: 'Email or Password incorrect.' })
        return
      }
      done(null, user)
    } catch (err) {
      done(err)
    }
  }))
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK,
    profileFields: ['displayName', 'email']
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const { name, email } = profile._json
      const user = await User.findOne({ where: { email } })
      if (user) {
        done(null, user)
        return
      }
      const createdUser = await User.create({
        name,
        email,
        password: bcrypt.hashSync(Math.random().toString(36).slice(-8), bcrypt.genSaltSync(10), null)
      })
      done(null, createdUser)
    } catch (err) {
      done(err)
    }
  }))
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findByPk(id)
      done(null, user.toJSON())
    } catch (err) {
      done(err)
    }
  })
}
