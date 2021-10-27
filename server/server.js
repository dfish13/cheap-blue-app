const express = require('express')
const cors = require('cors')
const path = require('path')

const session = require('express-session')
const sessionStore = require('connect-pg-simple')(session)
const { sessionPool } = require('./db')

class Server {
  constructor(port, node_env) {
    this.app = express()
    this.port = port
    this.node_env = node_env

    this.paths = {
      auth: '/api/auth',
      engine: '/api/engine'
    }

    this.middleware()
    this.routes()
  }

  middleware() {
    this.app.use(cors())
    this.app.use(express.json())

    this.app.use(session({
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

    if (this.node_env === 'production')
      this.app.use(express.static(path.join(__dirname, '../client/build')))
  }

  routes() {
    this.app.use(this.paths.auth, require('./routes/auth'))
    this.app.use(this.paths.engine, require('./routes/engine'))

    if (this.node_env === 'production')
      this.app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../client/build/index.html'))
      })
  }

  listen() {
    this.app.listen(this.port, () => console.log('Server running on port: ', this.port))
  }

  
}

module.exports = Server
