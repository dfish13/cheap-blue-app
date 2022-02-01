const {
  addUser,
  updateUserSession,
  fetchUser
} = require('../db')

const bcrypt = require('bcryptjs')
const saltRounds = 10;

const login = async (req, res) => {
  const user = await fetchUser(req.body.uname)
  if (user) {
    bcrypt.compare(req.body.pass, user.pw_hash)
    .then((result) => {
      if (result) {
        // Session data is null the first time logging in with one of the default users.
        const sd = user.session_data || {uid: user.id, uname: user.uname }
        req.session.data = sd
        sd.is_admin = user.is_admin
        res.send({success: true, data: sd, message: "Login successful"})
      }
      else 
        res.send({success: false, field: "pass", message: "Incorrect password"})
    })
    .catch((err) => console.log(err))
  }
  else
    res.send({success: false, field: "uname", message: "User does not exist"})
}

const logout = async (req, res) => {
  // Save session to db
  updateUserSession(req.session.data.uid, req.body.session_data)
  req.session.data = null
  res.send({success: true, message: "Logout successful"})
}

const adduser = async (req, res) => {
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
}

const getsession = async (req, res) => {
  if (req.session.data)
    res.send({success: true, data: req.session.data, message: 'User session loaded'})
  else
    res.send({success: false, message: 'No user session'})
}

const syncsession = async (req, res) => {
  req.session.data = req.body.session_data
  res.send({success: true, message: "Session synchronized with server"})
}

module.exports = {
  login,
  logout,
  adduser,
  getsession,
  syncsession
}