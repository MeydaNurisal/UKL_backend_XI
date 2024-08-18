/** load library express */
const express = require('express')
/** create object that instances of express */
const app = express()
/** define port of server */
const PORT = 7000
/** load library cors */
const cors = require('cors')
/** open CORS policy */
app.use(cors())


// Routes
const authRouter = require('./router/auth.router')
const adminRouter = require('./router/admin.router')
const coffeeRouter = require ('./router/coffee.router')
const orderRouter = require ('./router/order.router')




// Middleware
app.use('/auth', authRouter)
app.use('/admin', adminRouter)
app.use('/coffee',coffeeRouter)
app.use('/order', orderRouter)

/** run server based on defined port */
app.listen(PORT, () => {
    console.log(`Server of Ticket Sales runs on port ${PORT}`)
})
