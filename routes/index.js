const express = require('express');

const router = express.Router();

// Do work here
router.get('/', (req, res) => {
  const eddie = { name: 'Eddie', age: 100, cool: true };
  // console.log('Hey');
  // res.send('Hey! It works!');
  res.json(eddie);
});

router.get('/reverse/:name', (req, res) => {
  const reverse = [...req.params.name].reverse().join('');
  res.send(reverse);
});

module.exports = router;
