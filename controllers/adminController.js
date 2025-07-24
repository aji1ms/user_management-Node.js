const User = require('../models/userModels')
const bcrypt = require("bcrypt")


const securePassword = async (password) => {
   try {

      const passwordHash = await bcrypt.hash(password, 10)
      return passwordHash

   } catch (error) {
      console.log(error.message);

   }
}

const loadLogin = async (req, res) => {
   try {
      const error = req.session.adminLoginError;
      req.session.adminLoginError = ''
      res.render('login', {message:error})

   } catch (error) {
      console.log(error.message);

   }
}
const verifyLogin = async (req, res) => {
   try {
      const email = req.body.email
      const password = req.body.password

      const userData = await User.findOne({ email: email })

      if (userData) {   
         if (userData.is_admin === 1) {
            const passwordMatch = await bcrypt.compare(password, userData.password)

            if (passwordMatch) {

               req.session.admin = userData
               return res.redirect('/admin/home')


            } else {
               req.session.adminLoginError = "Password is incorrect"
               return res.redirect('/admin/login')
               // return res.render('login', { message: "Password is incorrect" })
            }
         } else {
            return res.render('login', { message: "You are not a admin" })

         }
      } else {
         return res.render('login', { message: "Email not found" })

      }
   } catch (error) {
      console.log(error.message)
   }
}
const loadDashboard = async (req, res) => {
   try {
      const userData = req.session.admin
      res.render('home', { admin: userData })
   } catch (error) {
      console.log(error.message);

   }
}

const logout = async (req, res) => {
   try {
      req.session.admin = null
      res.redirect('/admin')
   } catch (error) {
      console.log(error.message);

   }
}
const adminDashboard = async (req, res) => {
   try {
      const searchQuery = req.query.search || ''; 
      let users; 

      if (searchQuery) {
 
         users = await User.find({
            is_admin: 0,
            $or: [
               { name: { $regex: searchQuery, $options: 'i' } },
               { email: { $regex: searchQuery, $options: 'i' } }
            ]
         });
         return res.render('dashboard', {
            users,
            search: searchQuery
         });
      } else {

         users = await User.find({ is_admin: 0 });
         return res.render('dashboard', { users: users, search: searchQuery })
      }

   } catch (error) {  
      console.log(error.message);
  
   }
}

const newUserLoad = async (req, res) => {
   try {
      res.render('new-user')

   } catch (error) {
      console.log(error.message);

   }
}
const addUser = async (req, res) => {
   try {

      // Check if the email already exists in the database
      const existingUser = await User.findOne({ email: req.body.email });
      if (existingUser) {
         return res.render('registration', { message: 'Email ID already exists' });
      }

      const spassword = await securePassword(req.body.password)

      const name = req.body.name
      const email = req.body.email
      const mno = req.body.mno
      const password = spassword

      const user = new User({
         name: name,
         email: email,
         mobile: mno,
         password: spassword,
         is_admin: 0
      })
      const userData = await user.save()

      if (userData) {
         res.redirect('/admin/dashboard')
      } else {
         res.render('new-user', { message: "something wrong..." })
      }

   } catch (error) {
      console.log(error.message);

   }
}

// edit users data

const editUserLoad = async (req, res) => {
   try {
      const id = req.query.id
      const userData = await User.findById({ _id: id })

      if (userData) {
         res.render('edit-user', { user: userData })
      } else {
         res.redirect('/admin/dashboard')
      }

   } catch (error) {
      console.log(error.message);

   }
}

const updateUser = async (req, res) => {
   try {

      const userData = await User.findByIdAndUpdate({ _id: req.body.id }, { $set: { name: req.body.name, email: req.body.email, mobile: req.body.mno } })

      res.redirect('/admin/dashboard')

   } catch (error) {
      console.log(error.message);

   }
}

const deleteUser = async (req, res) => {
   try {

      const id = req.query.id
      await User.deleteOne({ _id: id })
      res.redirect('/admin/dashboard')

   } catch (error) {
      console.log(error.message);

   }
}

module.exports = {
   loadLogin,
   verifyLogin,
   loadDashboard,
   logout,
   adminDashboard,
   newUserLoad,
   addUser,
   editUserLoad,
   updateUser,
   deleteUser
}