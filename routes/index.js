const express = require('express')

const home = require('./modules/home.js')
const todos = require('./modules/todos.js')
const users = require('./modules/users.js')

const router = express.Router()

router.use('/todos', todos)
router.use('/users', users)
router.use('/', home)

module.exports = router
