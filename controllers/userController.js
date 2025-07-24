const User = require('../models/userModels')
const bcrypt = require("bcrypt")


const securePassword = async (password) =>{
   try {
      
     const passwordHash = await bcrypt.hash(password,10)
     return passwordHash

   } catch (error) {
      console.log(error.message);
         
   }
}

const loadRegister = async(req,res) => {
   try {
      
      res.render("registration")

   } catch (error) {
      console.log(error.message)
   }
} 

const insertUser = async(req,res) =>{
   try {

      // Check if the email already databasil undo enn check cheyunnu

      const existingUser = await User.findOne({ email: req.body.email });
         if (existingUser) {
            return res.render('registration', { message: 'Email ID already exists' });
         }

      const spassword = await securePassword(req.body.password)
      const user = new User({
         name:req.body.name,
         email:req.body.email,
         password:spassword,
         is_admin:0 
      })
 
      const userData = await user.save()
       
      if(userData){
         res.render('login')
      }
      else{
         res.render('registration',{message:"Your registration has been failed"})

      }

   } catch (error) {
      console.log(error.message);
      
   } 
}
// login user methods started

const loginLoad = async(req,res)=>{
   try {
      res.render('login')
   } catch (error) {
      console.log(error.message)
   }
}
 const verifyLogin = async(req,res) =>{
   try {
      const email = req.body.email
      const password = req.body.password

      const userData = await User.findOne({email:email})
      
      if(userData){
           const passwordMatch = await bcrypt.compare(password,userData.password)
           
           if(passwordMatch){
             
                  req.session.user = userData
                  res.redirect('/home')

           }else{
            res.render('login',{message:"Email and password is incorrect"})  

           }
      }else{
         res.render('login',{message:"Email and password is incorrect"})

      }  

   } catch (error) {
      console.log(error.message);
      
   }
 }
 const loadHome = async(req,res)=>{
   try {
      const userData =  await req.session.user
      res.render('home',{user:userData}) 
   } catch (error) {
      console.log(error.message);
      
   }
 } 
const userLogout = async(req,res) =>{
   try {
      
      req.session.destroy()
      res.redirect('/')

   } catch (error) {
      console.log(error.message);
      
   }
}
// user profile update and delete

// const editUser = async(req,res)=>{
//    try {
      
//       const id = req.query.id
//       const userData = await User.findById({_id:id})

//       if(userData){
//          res.render("edit",{user:userData})

//       }else{
//          res.redirect("/home")
//       }

//    } catch (error) {
//       console.log(error.message)
//    }
// }
// const updateProfile = async(req,res) =>{
//    try {

//       await User.findByIdAndUpdate({_id:req.body.user_id},{$set:{name:req.body.name, email:req.body.email ,mobile:req.body.mno}})
//       res.redirect("/home")

//    } catch (error) {
//       console.log(error.message);
      
//    }
// } 

module.exports = {
   loadRegister,
   insertUser,
   loginLoad,
   verifyLogin,
   loadHome,
   userLogout,
   // editUser,
   // updateProfile
}
  