const mongoose = require("mongoose")
mongoose.connect("mongodb+srv://ajimsismail123:4aXdI5YcFRIm4uZa@cluster0.5cw8pis.mongodb.net/")

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
    