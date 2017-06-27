/**
 * Router for "non-dashboard" pages
 */
import express from 'express'
import bodyParser from 'body-parser'
import { checkSession, login } from './middlewares'

import index from './endpoints/index'
import parseArticle from './endpoints/parseArticle'
import annotate from './endpoints/annotate'

const router = express.Router()
const urlencodedParser = bodyParser.urlencoded({ extended: false })

router.get('/', checkSession, index)
router.get('/parseArticle', parseArticle)
router.get('/annotate', checkSession, annotate)

router.get('/about', (req, res) => {
  res.render('about')
})

router.post('/login', urlencodedParser, login, (req, res) => {
  res.redirect('/')
})

router.get('/login', (req, res) => {
  res.render('index')
})

router.get('*', (req, res) => {
  res.send('404 Not found')
})

export default router
