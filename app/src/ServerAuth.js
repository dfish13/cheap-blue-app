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

    async login(uname, pass, cb, errorCB) {
      const res = await axios.post('/login', {uname: uname, pass: pass})
      console.log(res.data.message)
      if (res.data.success)
      {
        ServerAuth.isAuthenticated = true
        cb(res.data.data)
      }
      else
        errorCB(res.data.message)
    },

    logout(s, cb) {
      console.log(s)
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
          errorCB(res.data.message)
      })
    },

    syncsession(s) {
      axios.post('/syncsession', { session_data: s })
    }
};

export default ServerAuth