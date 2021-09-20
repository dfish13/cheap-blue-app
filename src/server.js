const express = require('express')
var cors = require('cors')
var app = express()

const util = require('util');
const execFile = util.promisify(require('child_process').execFile);

const port = 4000

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  console.log(req.body);
  res.send('Hello World!')
})

app.post('/move', (req, res) => {
  execFile('./cheapblue', ['-m', req.body.fen])
  .then(({stdout}) => {
    console.log(stdout)
    res.send(stdout);
  })
  .catch((err) => console.log(err));
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
  execFile('./cheapblue', ['-p', req.body.depth, req.body.fen])
  .then(({stdout}) => {
    res.json(parsePerftOutput(stdout))
  })
  .catch((err) => console.log(err))
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})