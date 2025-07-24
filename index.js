const mongoose = require("mongoose")
mongoose.connect("mongodb://127.0.0.1:27017/user_management_system")

const express = require("express")
const app = express()
const nocache = require("nocache")
const path = require('path')
 
app.use(nocache()) 
app.use(express.static(path.join(__dirname, 'public')));

  
//for user routes
const userRoute =  require('./routes/userRoutes')
app.use('/',userRoute) 

// for admin routes
const adminRoute =  require('./routes/adminRoutes')
app.use('/admin',adminRoute)

app.listen(3000,()=> console.log("server running at port: http://localhost:3000"))           
    