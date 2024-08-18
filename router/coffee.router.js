const express = require ('express')
const app = express();
const auth = require ('../controllers/auth.controllers')
app.use(express.json())
const coffeeControllers = require ('../controllers/coffee.controllers')
app.get('/', coffeeControllers.getAllCoffee)
app.get('/:key', coffeeControllers.findCoffee)
app.post('/', auth.authorize, coffeeControllers.addCoffee)
app.put('/:id', auth.authorize, coffeeControllers.updateCoffee)
app.delete('/:id', auth.authorize, coffeeControllers.deleteCoffee)
module.exports=app