/**
 * Router for "non-dashboard" pages
 */
import express from 'express'
import bodyParser from 'body-parser'
import checkSession from './middlewares/check-session'
import login from './middlewares/login'

import index from './endpoints/index'
import parseArticle from './endpoints/parse-article'
import annotate from './endpoints/annotate'
import importFromMedium from './endpoints/import-from-medium'
import connectWithMedium from './endpoints/connect-with-medium'
import callbackFromMedium from './endpoints/callback-from-medium'
import getMediumPosts from './endpoints/get-medium-posts'

const router = express.Router()
const urlencodedParser = bodyParser.urlencoded({ extended: false })

router.get('/', checkSession, index)
router.get('/parse-article', parseArticle)
router.get('/annotate', checkSession, annotate)
router.get('/import-from-medium', checkSession, (req, res) => {
  console.log('ENDPOINT GET /import-from-medium. Checking if the user is connected to Medium')
  if (req.currentUser.medium_credential) {
    res.render('import-from-medium-step2', {user: req.currentUser.medium_credential})
  } else {
    res.render('import-from-medium-step1')
  }
})
router.get('/callbacks/medium', checkSession, callbackFromMedium)
router.post('/connect-with-medium', checkSession, connectWithMedium)
router.post('/import-from-medium', checkSession, urlencodedParser, importFromMedium)
router.get('/get-medium-posts', getMediumPosts)

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
