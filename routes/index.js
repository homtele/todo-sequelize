const express = require('express')
const { authenticator } = require('../middlewares')

const home = require('./modules/home.js')
const todos = require('./modules/todos.js')
const users = require('./modules/users.js')

const router = express.Router()

router.use('/todos', authenticator, todos)
router.use('/users', users)
router.use('/', authenticator, home)

module.exports = router
