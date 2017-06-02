const mongoose = require('mongoose');

exports.loginForm = (req, res) => {
  res.render('login', { title: 'Login' });
};

exports.register = (req, res) => {
  res.render('register', { title: 'Register' });
};
