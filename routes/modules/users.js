const bcrypt = require('bcryptjs')
const express = require('express')
const passport = require('passport')

const { User } = require('../../models')

const router = express.Router()

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body
    const user = await User.findOne({ where: { email } })
    if (user) {
      console.log('user already exists')
      res.render('register')
      return
    }
    if (password !== confirmPassword) {
      res.render('register')
      return
    }
    await User.create({
      name,
      email,
      password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
    })
    res.redirect('/users/login')
  } catch (err) {
    console.log(err)
  }
})

router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login'
}))

router.get('/logout', (req, res) => {
  res.send('logout')
})

module.exports = router
