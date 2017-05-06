/**
 * Router for "non-dashboard" pages
 */
import express from 'express'
import bodyParser from 'body-parser'
import { checkSession, login } from './middlewares'

const router = express.Router()
const urlencodedParser = bodyParser.urlencoded({ extended: false })

router.get('/', checkSession, (req, res, next) => {
  if (req.currentUser) {
    next()
  } else {
    res.render('index')
  }
})

router.post('/login', urlencodedParser, login, (req, res) => {
  if (!req.body) {
    return res.send('LOGIN FAIL')
  }

  if (req.user) {
    res.send('I am IN')
  } else {
    res.render('index')
  }
})

router.get('/login', (req, res) => {
  res.render('index')
})

router.get('*', checkSession, (req, res, next) => {
  if (req.currentUser) {
    res.send('This is REACT!!!')
  } else {
    res.send('404 Not found')
  }
})

export default router
