const express = require('express')

const { Todo } = require('../../models')

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const todos = await Todo.findAll({ raw: true, nest: true })
    res.render('index', { todos })
  } catch (err) {
    console.log(err)
  }
})

module.exports = router
