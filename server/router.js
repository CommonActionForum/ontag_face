/**
 * Router for "non-dashboard" pages
 */
import express from 'express'
import bodyParser from 'body-parser'
import { checkSession, login } from './middlewares'

import parseArticle from './endpoints/parseArticle'
import annotate from './endpoints/annotate'

const router = express.Router()
const urlencodedParser = bodyParser.urlencoded({ extended: false })

router.get('/', checkSession, (req, res, next) => {
  console.log('Calling core.questions.show')
  req.core.questions.show(1)
    .then(question => {
      res.render('dashboard', {question})
    })
    .catch(e => {
      console.log('Call failed. Showing error ', e)
      res.redirect('/login')
    })
})

router.get('/parseArticle', parseArticle)
router.get('/annotate', checkSession, annotate)
router.get('/about', (req, res, next) => {
  res.render('about')
})

router.post('/login', urlencodedParser, login, (req, res) => {
  res.redirect('/')
})

router.get('/login', (req, res) => {
  res.render('index')
})

// Temporal backend.
//
// In a future, replace this with a GraphQL endpoint
router.get('/backend', (req, res) => {
  req
    .core.articles.index()
    .then(articles => res.json(articles))
    .catch(err => res.json(err))
})

router.get('*', (req, res, next) => {
  res.send('404 Not found')
})

export default router
