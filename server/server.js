const express = require('express')
const cors = require('cors')
const app = express()

const util = require('util')
const execFile = util.promisify(require('child_process').execFile)

const {
  sessionPool,
  addUser,
  updateUserSession,
  fetchUser,
  fetchAllUsers,
  addGame
} = require('./db')

const session = require('express-session')
const sessionStore = require('connect-pg-simple')(session)

const bcrypt = require('bcryptjs')
const saltRounds = 10;

const port = 4000

app.use(cors())
app.use(express.json())
app.use(session({
  store: new sessionStore({
    pool: sessionPool
  }),
  secret: 'krabby patty secret formula',
  saveUninitialized: false,
  resave: false,
  cookie: {
    httpOnly: true,
    maxAge: (1000 * 60 * 60 * 24) // 1 days worth of milliseconds
  }
}))

app.get('/', async (req, res) => {
  const rows = await fetchAllUsers()
  res.json(rows)
})

app.post('/syncsession', (req, res) => {
  req.session.data = req.body.session_data
  res.send({success: true, message: "Session synchronized with server"})
})

app.post('/move', (req, res) => {
  execFile('./cheap-blue/bin/main', ['-m', req.body.fen])
  .then(({stdout}) => {
    if (stdout === "None")
      res.send({success: false, message: 'No legal moves'})
    else
      res.send({success: true, move: stdout, message: 'Engine move'})
  })
  .catch((err) => console.log(err));
})

app.post('/adduser', async (req, res) => {
  const user = await fetchUser(req.body.uname)
  if (user) {
    res.send({success: false, field: "uname", message: "User already exists"})
  }
  else {
    const hash = await bcrypt.hash(req.body.pass, saltRounds)
    await addUser(req.body.uname, hash)
    const newUser = await fetchUser(req.body.uname)
    req.session.data = {uid: newUser.id, uname: newUser.uname}
    res.send({success: true, data: req.session.data, message: "User added"})
  }
})

app.post('/login', async (req, res) => {
  const user = await fetchUser(req.body.uname)
  if (user) {
    bcrypt.compare(req.body.pass, user.pw_hash)
    .then((result) => {
      if (result) {
        // Session data is null the first time logging in with one of the default users.
        const sd = user.session_data || {uid: user.id, uname: user.uname}
        req.session.data = sd
        res.send({success: true, data: sd, message: "Login successful"})
      }
      else 
        res.send({success: false, field: "pass", message: "Incorrect password"})
    })
    .catch((err) => console.log(err))
  }
  else
    res.send({success: false, field: "uname", message: "User does not exist"})
})

app.post('/logout', (req, res) => {
  // Save session to db
  updateUserSession(req.session.data.uid, req.body.session_data)
  req.session.data = null
  res.send({success: true, message: "Logout successful"})
})

app.post('/getsession', async (req, res) => {
  if (req.session.data)
    res.send({success: true, data: req.session.data, message: 'User session loaded'})
  else
    res.send({success: false, message: 'No user session'})
})

app.post('/addgame', (req, res) => {
  addGame(req.body.values)
  res.send({success: true, message: "Game added"})
})

const parsePerftOutput = (output) => {
  const lines = output.split(/\n/)

  const divided = lines.slice(1, lines.length - 2).map((s) => {
    const arr = s.split(/(\s+)/)
    return {
      move: arr[0],
      nodes: Number(arr[2])
    }
  })

  return {
    divided: divided,
    nodes: Number(lines[lines.length - 2].split(/(\s+)/)[6])
  }
}

app.post('/perft', (req, res) => {
  execFile('./cheap-blue/bin/main', ['-p', req.body.depth, req.body.fen])
  .then(({stdout}) => {
    res.json(parsePerftOutput(stdout))
  })
  .catch((err) => console.log(err))
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})