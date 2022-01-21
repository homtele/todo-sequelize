const express = require('express')

const { Todo } = require('../../models')

const router = express.Router()

router.get('/new', (req, res) => {
  res.render('new')
})

router.post('/', async (req, res) => {
  await Todo.create({
    name: req.body.name,
    UserId: req.user.id
  })
  res.redirect('/')
})

router.get('/:id', async (req, res, next) => {
  try {
    const todo = await Todo.findOne({ where: { id: req.params.id, UserId: req.user.id } })
    if (!todo) {
      next()
      return
    }
    res.render('detail', { todo: todo.toJSON() })
  } catch (err) {
    console.log(err)
  }
})

router.get('/:id/edit', async (req, res, next) => {
  const todo = await Todo.findOne({ where: { id: req.params.id, UserId: req.user.id } })
  if (!todo) {
    next()
    return
  }
  res.render('edit', { todo: todo.toJSON() })
})

router.put('/:id', async (req, res, next) => {
  try {
    const todo = await Todo.findOne({ where: { id: req.params.id, UserId: req.user.id } })
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

router.delete('/:id', async (req, res, next) => {
  try {
    const todo = await Todo.findOne({ where: { id: req.params.id, UserId: req.user.id } })
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
