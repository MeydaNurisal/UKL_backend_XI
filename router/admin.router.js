const express = require('express')
const app = express()
app.use(express.json())
const adminController = 
require ('../controllers/admin.controllers')
app.post("/",adminController.addAdmin)
module.exports=app