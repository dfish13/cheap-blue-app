const express = require('express')
const cors = require('cors')
const app = express()

require('dotenv').config();

const util = require('util')
const execFile = util.promisify(require('child_process').execFile)

const { Pool } = require('pg')
const pool = new Pool({
  user: 'duncan',
  host: 'postgres',
  database: 'cheap_blue_db',
  password: 'asdf',
  port: 5432,
})

const session = require('express-session')
const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const saltRounds = 10;

const port = 4000

app.use(cors())
app.use(express.json())
app.use(session({
  secret: process.env.SECRET,
  saveUninitialized: false,
  resave: false,
  cookie: {
    httpOnly: true,
    maxAge: parseInt(process.env.MAX_AGE)
  }
}))

app.get('/', (req, res) => {
  pool.query('SELECT * FROM players', (err, qRes) => {
    res.json(qRes.rows)
  })
})

app.post('/move', (req, res) => {
  execFile('./cheap-blue/bin/main', ['-m', req.body.fen])
  .then(({stdout}) => {
    console.log(stdout)
    res.send(stdout)
  })
  .catch((err) => console.log(err));
})

app.post('/addplayer', (req, res) => {
  const querytext = 'INSERT INTO players (player_name, player_token) VALUES ($1, $2)'
  const token = crypto.randomBytes(10).toString('hex')

  bcrypt.genSalt(saltRounds, (err, salt) => {
    bcrypt.hash(token, salt, (err, hash) => {
      pool.query(querytext, [req.body.name, hash])
      res.send(token)
    });
  });
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