/* eslint-disable object-shorthand */
import { Object } from 'core-js'
import express from 'express'
const jwt = require('jsonwebtoken')

const users = {}

const app = express()
app.use(express.json())

app.get('/date', verifyJWT, (req, res) => {
  res.json({ date: new Date() })
})

app.post('/login', (req, res, next) => {
  const { email } = req.body
  const token = jwt.sign({ userId: 1, email: email }, 'secretkeyappearshere', {
    expiresIn: '1h'
  })

  const user = {
    success: true,
    data: {
      token: {
        token: token,
        type: 'Bearer'
      },
      user: {
        username: email,
        firstName: 'firstName',
        lastName: 'latName'
      }
    }
  }

  users[email] = user

  res.status(200).json(user)
})

// [GET] /user
app.get('/users/user', (req, res) => {
  const email = Object.keys(users).find((email) => {
    return users[email].data.token.token === req.headers.authorization
  })
  res.json(users[email])
})

// [GET] /users/users
app.get('/users/users', verifyJWT, (req, res) => {
  res.json(users)
})

// [GET] /user
app.post('/users/token', (req, res) => {
  const { token } = req.body
  const email = Object.keys(users).find((email) => {
    return users[email].data.token.token === token
  })
  res.json(users[email])
})

function verifyJWT(req, res, next) {
  const token = req.headers.authorization
  if (!token)
    return res.status(401).json({ auth: false, message: 'No token provided.' })
  jwt.verify(token, 'secretkeyappearshere', function (err, decoded) {
    if (err)
      return res
        .status(500)
        .json({ auth: false, message: 'Failed to authenticate token.' })
    req.userId = decoded.id
    next()
  })
}

// [POST] /logout
app.post('/logout', (_req, res) => {
  res.json({ status: 'OK' })
})

// Error handler
app.use((err, _req, res) => {
  console.error(err) // eslint-disable-line no-console
  res.status(401).send(err + '')
})

// -- export app --
export default app
