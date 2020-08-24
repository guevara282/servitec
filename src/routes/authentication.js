const express = require('express');
const router = express.Router();
const pool = require('../database');
const passport = require('passport');
const { isLoggedIn, isNotLogguedIn } = require('../lib/auth');
const paths= require('../lib/path');

// SIGNUP
router.get('/signup',async (req, res) => {
  const rol=await pool.query('Select * from rol where estado=1');
   console.log(rol.idrol);
  res.render('auth/signup', {rol});
});

router.post('/signup', passport.authenticate('local.signup', {
  successRedirect: '/profile',
  failureRedirect: '/signup',
  failureFlash: true
}));

// SINGIN
router.get('/signin', isNotLogguedIn,(req, res) => {
  res.render('auth/signin');
});

router.post('/signin', (req, res, next) => {
  req.check('correo', 'Username is Required').notEmpty();
  req.check('contraseña', 'Password is Required').notEmpty();
  const errors = req.validationErrors();
  if (errors.length > 0) {
    req.flash('message', errors[0].msg);
    res.redirect('/signin');
  }
  passport.authenticate('local.signin', {
    successRedirect: '/profile',
    failureRedirect: '/signin',
    failureFlash: true
  })(req, res, next);
});

router.get('/logout', (req, res) => {
  req.logOut();
  res.redirect('/');
});

router.get('/profile', isLoggedIn, (req, res) => {
  paths.routes(req);
  res.render('profile');
});

module.exports = router;
