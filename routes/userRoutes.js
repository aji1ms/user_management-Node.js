const express = require("express")
const user_route = express() 
const session = require("express-session")

const config = require('../config/config')
const auth = require('../middleware/auth') 
user_route.use(session({secret:config.sessionSecret}))  

user_route.set('view engine','ejs')
user_route.set('views','./views/users')  

const bodyParser= require('body-parser')
user_route.use(bodyParser.json())
user_route.use(bodyParser.urlencoded({extended:true}))

const userController = require("../controllers/userController")

user_route.get('/register',auth.isLogout,userController.loadRegister) 

user_route.post('/register',auth.isLogout,userController.insertUser)

user_route.get('/',auth.isLogout,userController.loginLoad)

user_route.get('/login',auth.isLogout,userController.loginLoad)

user_route.post('/login',userController.verifyLogin) 

user_route.get('/home',auth.isLogin,userController.loadHome)

user_route.get('/logout',auth.isLogin,userController.userLogout)

// user_route.get('/edit',auth.isLogin,userController.editUser)

// user_route.post('/edit',userController.updateProfile) 

module.exports = user_route 
