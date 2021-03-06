const { Router } = require('express')
const router = Router()
const { checkAuth, checkAdmin } = require('../middleware/checkAuth')

const {
  move,
  eval,
  perft,
  addgame,
  fetchgames
} = require('../controllers/engine')

//router.use(checkAuth)
router.post('/move', move)
router.post('/perft', [checkAdmin], perft)
router.post('/addgame', addgame)
router.post('/games', fetchgames)
router.post('/eval', eval)

module.exports = router