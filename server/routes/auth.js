const { Router } = require('express')
const router = Router()

const {
  login,
  logout,
  adduser,
  getsession,
  syncsession
} = require('../controllers/auth')

router.post('/login', login)
router.post('/logout', logout)
router.post('/adduser', adduser)
router.post('/getsession', getsession)
router.post('/syncsession', syncsession)

module.exports = router