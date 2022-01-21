if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const exphbs = require('express-handlebars')
const session = require('express-session')
const methodOverride = require('method-override')
const { locals } = require('./middlewares')
const usePasspert = require('./config/passport.js')
const routes = require('./routes')

const app = express()

app.engine('hbs', exphbs.engine({ extname: 'hbs' }))
app.set('view engine', 'hbs')

app.use(express.urlencoded({ extended: true }))
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true }))
app.use(methodOverride('_method'))
usePasspert(app)
app.use(locals)
app.use(routes)
app.use((err, req, res, next) => {
  if (!err) {
    res.status(404).send('err')
    return
  }
  res.status(500).send(err)
})

app.listen(process.env.PORT, () => {
  console.log(`App is running on http://localhost:${process.env.PORT}`)
})
