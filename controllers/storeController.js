exports.homePage = (req, res) => {
  res.render('homepage');
};

exports.reverse = (req, res) => {
  const reverse = [...req.params.name].reverse().join('');
  res.send(reverse);
};
