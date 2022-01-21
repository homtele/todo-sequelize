module.exports = (req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  res.locals.success_message = req.flash('success_message')
  res.locals.warning_message = req.flash('warning_message')
  res.locals.error = req.flash('error')
  next()
}
