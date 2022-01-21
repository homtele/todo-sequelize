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
    const errors = []
    if (!name || !email || !password || !confirmPassword) {
      errors.push({ message: 'All fields are required.' })
    }
    if (user) {
      errors.push({ message: 'This email is already registered.' })
    }
    if (password !== confirmPassword) {
      errors.push({ message: 'Those passwords didn’t match.' })
    }
    if (errors.length) {
      res.render('register', { errors })
      return
    }
    await User.create({
      name,
      email,
      password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
    })
    req.flash('success_message', 'Register successfully! Please login.')
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
  failureRedirect: '/users/login',
  failureFlash: true
}))

router.get('/logout', (req, res) => {
  req.logout()
  req.flash('sucess_message', 'Logged out successfully.')
  res.redirect('/users/login')
})

module.exports = router
