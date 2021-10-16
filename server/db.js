
require('dotenv').config();

const { Pool } = require('pg')

const pool = new Pool({
  user: process.env.PG_USER,
  host: 'postgres',
  database: process.env.PG_DB,
  password: process.env.PG_PASSWORD,
  port: 5432,
})

const sessionPool = new Pool({
  user: process.env.PG_USER,
  host: 'postgres',
  database: process.env.PG_DB,
  password: process.env.PG_PASSWORD,
  port: 5432,
})

const updateUserSession = async (uid, session_data) => {
  const query = {
    name: 'update-user-session',
    text: 'UPDATE users SET session_data = $1 WHERE id = $2',
    values: [session_data, uid]
  }
  const qRes = await pool.query(query)
  return qRes
}

const addUser = async (uname, hash) => {
  const query = {
    name: 'add-user',
    text: 'INSERT INTO users (uname, pw_hash) VALUES ($1, $2)',
    values: [uname, hash]
  }
  await pool.query(query)
}

const fetchUser = async (uname) => {
  const query = {
    name: 'fetch-user',
    text: 'SELECT * FROM users WHERE uname = $1',
    values: [uname]
  }
  const qRes = await pool.query(query)
  return qRes.rows[0]
}

const fetchAllUsers = async () => {
  const qRes = await pool.query('SELECT * FROM users')
  return qRes.rows
}

const fetchUserById = async (uid) => {
  const query = {
    name: 'fetch-user-by-id',
    text: 'SELECT * FROM users WHERE id = $1',
    values: [uid]
  }
  const qRes = await pool.query(query)
  return qRes.rows[0]
}

const addGame = async (values) => {
  const query = {
    name: 'add-game',
    text: 'INSERT INTO games (user_id, user_color, pgn, result) VALUES ($1, $2, $3, $4)',
    values: values
  }
  await pool.query(query)
}

exports.sessionPool = sessionPool
exports.addUser = addUser
exports.updateUserSession = updateUserSession
exports.fetchUserById = fetchUserById
exports.fetchUser = fetchUser
exports.fetchAllUsers = fetchAllUsers
exports.addGame = addGame