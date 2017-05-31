const express = require('express');

const router = express.Router();

// Do work here
router.get('/', (req, res) => {
  const eddie = { name: 'Eddie', age: 100, cool: true };
  res.render('hello', eddie);
});

router.get('/reverse/:name', (req, res) => {
  const reverse = [...req.params.name].reverse().join('');
  res.send(reverse);
});

module.exports = router;
