const express = require('express')
const orderController = require('../controllers/order.controllers')
const auth =  require('../controllers/auth.controllers')
const app = express()
app.use(express.json())
app.get('/', auth.authorize,orderController.findAll)
app.post('/', orderController.addOrder)


module.exports = app

