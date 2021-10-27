const axios = require('axios')

const ServerAuth = {

    isAuthenticated: false,

    getsession(cb) {
      axios.post('/api/auth/getsession', {})
      .then((res) => {
        console.log(res.data.message)
        if (res.data.success)
        {
          ServerAuth.isAuthenticated = true
          cb(res.data.data)
        }
        else
          ServerAuth.isAuthenticated = false
      })
    },

    move(body, cb) {
      axios.post('/api/engine/move', body)
      .then((res) => {
        cb(res)
      })
    },

    addgame(values) {
      axios.post('/api/engine/addgame', {values: values})
    },

    login(uname, pass, cb, errorCB) {
      axios.post('/api/auth/login', {uname: uname, pass: pass})
      .then((res) => {
        console.log(res.data.message)
        if (res.data.success)
        {
          ServerAuth.isAuthenticated = true
          cb(res.data.data)
        }
        else
          errorCB(res.data)
      })
    },

    logout(s, cb) {
      axios.post('/api/auth/logout', {session_data: s})
      .then((res) => {
        console.log(res.data.message)
        if (res.data.success)
        {
          ServerAuth.isAuthenticated = false
          cb()
        }
      })
    },

    adduser(uname, pass, cb, errorCB) {
      axios.post('/api/auth/adduser', {uname: uname, pass: pass})
      .then((res) => {
        console.log(res.data.message)
        if (res.data.success)
        {
          ServerAuth.isAuthenticated = true
          cb(res.data.data)
        }
        else
          errorCB(res.data)
      })
    },

    syncsession(s) {
      axios.post('/api/auth/syncsession', { session_data: s })
    }
};

export default ServerAuth