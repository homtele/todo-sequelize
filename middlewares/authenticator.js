module.exports = (req, res, next) => {
  if (!req.isAuthenticated()) {
    res.redirect('/users/login')
    return
  }
  next()
}
