const express = require('express')

const { Todo } = require('../../models')

const router = express.Router()

router.get('/new', (req, res) => {
  res.render('new')
})

router.post('/', async (req, res) => {
  await Todo.create({
    name: req.body.name,
    UserId: 1
  })
  res.redirect('/')
})

router.get('/:id/edit', async (req, res) => {
  const todo = await Todo.findByPk(req.params.id)
  res.render('edit', { todo: todo.toJSON() })
})

router.put('/:id', async (req, res, next) => {
  try {
    const todo = await Todo.findByPk(req.params.id)
    if (!todo) {
      next()
      return
    }
    todo.set({
      name: req.body.name,
      isDone: req.body.isDone === 'on',
      updatedAt: new Date()
    })
    await todo.save()
    res.redirect('/')
  } catch (err) {
    console.log(err)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const todo = await Todo.findByPk(req.params.id)
    if (!todo) {
      next()
      return
    }
    res.render('detail', { todo: todo.toJSON() })
  } catch (err) {
    console.log(err)
  }
})

router.delete('/:id', async (req, res, next) => {
  try {
    const todo = await Todo.findByPk(req.params.id)
    if (!todo) {
      next()
      return
    }
    await todo.destroy()
    res.redirect('/')
  } catch (err) {
    console.log(err)
  }
})

module.exports = router
