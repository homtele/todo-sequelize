const express = require('express')
const { authenticator } = require('../middlewares')

const auth = require('./modules/auth.js')
const home = require('./modules/home.js')
const todos = require('./modules/todos.js')
const users = require('./modules/users.js')

const router = express.Router()

router.use('/auth', auth)
router.use('/todos', authenticator, todos)
router.use('/users', users)
router.use('/', authenticator, home)

module.exports = router
