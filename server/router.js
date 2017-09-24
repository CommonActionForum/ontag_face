/**
 * Router for "non-dashboard" pages
 */
import express from 'express'
import bodyParser from 'body-parser'
import checkSession from './middlewares/check-session'
import login from './middlewares/login'

import index from './endpoints/index'
import parseArticle from './endpoints/parseArticle'
import annotate from './endpoints/annotate'

const router = express.Router()
const urlencodedParser = bodyParser.urlencoded({ extended: false })

router.get('/', checkSession, index)
router.get('/parseArticle', parseArticle)
router.get('/annotate', checkSession, annotate)

router.get('/about', (req, res) => {
  console.log('ENDPOINT /about. Rendering about')
  res.render('about')
})

router.post('/login', urlencodedParser, login, (req, res) => {
  console.log('ENDPOINT POST /login. Redirecting to home')
  res.redirect('/')
})

router.get('/login', (req, res) => {
  console.log('ENDPOINT GET /login. Rendering index')
  res.render('index')
})

router.get('*', (req, res) => {
  console.log('ENDPOINT 404. ' + req.originalUrl)
  res.send('404 Not found')
})

export default router
