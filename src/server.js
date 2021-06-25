const express = require('express')
var cors = require('cors')
var app = express()

const { Chess } = require('chess.js')

const port = 4000

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  console.log(req.body);
  res.send('Hello World!')
})

app.post('/move', (req, res) => {
  console.log(req.body);
  const chess = new Chess(req.body.fen);
  const moves = chess.moves();

  res.send(moves[Math.floor(Math.random() * moves.length)]);
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})