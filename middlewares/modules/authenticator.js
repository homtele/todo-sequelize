module.exports = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash('warning_message', 'Login to use Todo List.')
    res.redirect('/users/login')
    return
  }
  next()
}
