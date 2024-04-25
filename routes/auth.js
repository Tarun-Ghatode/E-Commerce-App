const express = require('express');
const User = require('../models/User');
const passport = require('passport');
const router = express.Router(); //mini application


// For Register

router.get('/register', (req, res)=>{
    res.render('auth/signup');
    // res.render('./auth/signup');
})

router.post('/register', async (req, res)=>{
    // console.log(req.body);

    let { username, email, role, gender, password} = req.body;
    let user = new User( { username, email, role, gender} );

    let newUser = await User.register(user, password);

    // res.send(newUser);
    res.redirect('/login');


})


// For Login

router.get('/login' , (req,res)=>{
    res.render('auth/login');
})

router.post('/login',
  passport.authenticate('local', 
  { 
    failureRedirect: '/login', 
    failureMessage: true 
  }),
  function(req, res) {
    // console.log(req.user , "user");
    req.flash('success' , `Welcome Back ${req.user.username}`)
    res.redirect('/products');
});


// for logout

router.get('/logout' , (req,res)=>{
    req.logout(()=>{
        req.flash('success' , 'Logged out successfully')
        res.redirect('/login');
    });
})


module.exports = router;
