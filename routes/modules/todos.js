const express = require('express')

const { Todo } = require('../../models')

const router = express.Router()

router.get('/:id', async (req, res) => {
  try {
    const todo = await Todo.findByPk(req.params.id)
    res.render('detail', { todo: todo.toJSON() })
  } catch (err) {
    console.log(err)
  }
})

module.exports = router
