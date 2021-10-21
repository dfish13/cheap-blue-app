const axios = require('axios')

const ServerAuth = {

    isAuthenticated: false,

    getsession(cb) {
      axios.post('/getsession', {})
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
      axios.post('/move', body)
      .then((res) => {
        cb(res)
      })
    },

    addgame(values) {
      axios.post('/addgame', {values: values})
    },

    login(uname, pass, cb, errorCB) {
      axios.post('/login', {uname: uname, pass: pass})
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
      axios.post('/logout', {session_data: s})
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
      axios.post('/adduser', {uname: uname, pass: pass})
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
      axios.post('/syncsession', { session_data: s })
    }
};

export default ServerAuth