const bcrypt = require('bcryptjs')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const exphbs = require('express-handlebars')
const session = require('express-session')
const methodOverride = require('method-override')

const { Todo, User } = require('./models')

const app = express()

app.engine('hbs', exphbs.engine({ extname: 'hbs' }))
app.set('view engine', 'hbs')

app.use(express.urlencoded({ extended: true }))
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true }))
app.use(methodOverride('_method'))

app.get('/', async (req, res) => {
  try {
    const todos = await Todo.findAll({ raw: true, nest: true })
    res.render('index', { todos })
  } catch (err) {
    console.log(err)
  }
})

app.get('/todos/:id', async (req, res) => {
  try {
    const todo = await Todo.findByPk(req.params.id)
    res.render('detail', { todo: todo.toJSON() })
  } catch (err) {
    console.log(err)
  }
})

const passport = require('passport')
const usePasspert = require('./config/passport.js')

usePasspert(app)

app.get('/users/login', (req, res) => {
  res.render('login')
})

app.post('/users/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login'
}))

app.get('/users/register', (req, res) => {
  res.render('register')
})

app.post('/users/register', async (req, res) => {
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
    res.redirect('/')
  } catch (err) {
    console.log(err)
  }
})

app.get('/users/logout', (req, res) => {
  res.send('logout')
})

app.listen(process.env.PORT, () => {
  console.log(`App is running on http://localhost:${process.env.PORT}`)
})
