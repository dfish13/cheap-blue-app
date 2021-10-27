require('dotenv').config()

const port = 4000
const Server = require('./server/server')
const server = new Server(port, process.env.NODE_ENV)

server.listen()