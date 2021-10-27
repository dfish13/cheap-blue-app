const {
  addGame,
  fetchGamesByUserId
} = require('../db')

const util = require('util')
const execFile = util.promisify(require('child_process').execFile)

// This path is relative to the root directory, where the app is running.
const enginePath = './cheap-blue/bin/main'

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

const move = (req, res) => {
  const args = [
    '-m',
    req.body.thinkingTime,
    req.body.pvSort,
    req.body.fen
  ]

  execFile(enginePath, args)
  .then(({stdout}) => {
    if (stdout === "None")
      res.send({success: false, message: 'No legal moves'})
    else
      res.send({success: true, move: stdout, message: 'Engine move'})
  })
  .catch((err) => console.log(err));
}

const perft = (req, res) => {
  execFile(enginePath, ['-p', req.body.depth, req.body.fen])
  .then(({stdout}) => {
    res.json(parsePerftOutput(stdout))
  })
  .catch((err) => console.log(err))
}

const addgame = (req, res) => {
  addGame(req.body.values)
  res.send({success: true, message: "Game added"})
}

const fetchgames = async (req, res) => {
  const rows = await fetchGamesByUserId(req.body.uid)
  console.log(rows)

  res.send({success: true, rows: rows, message: 'Fetched games for user'})
}

module.exports = {
  move,
  perft,
  addgame,
  fetchgames
}