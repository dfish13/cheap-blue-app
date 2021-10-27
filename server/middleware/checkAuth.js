
const checkAuth = (req, res, next) => {
  console.log(req.session.data)
  if (req.session.data)
    next()
  else
    res.send({success: false, message: 'Not authenticated'})
}

const checkAdmin = (req, res, next) => {
  // TODO
  next()
}

module.exports = {
  checkAuth,
  checkAdmin
}