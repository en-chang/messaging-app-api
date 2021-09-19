const handleSignin = (req, res, db) => {
  db.select('email', 'password').from('users')
    .where('email', '=', req.body.email)
    .then(data => {
      if (req.body.password === data[0].password) {
        return db.select('*').from('users')
          .where('email', '=', req.body.email)
          .then(user => {
            res.json(user[0])
          })
          .catch(err => res.status(400).json('unable to get user'))
      } else {
        res.status(400).json('wrong credentials')
      }
    })
    .catch(err => res.status(400).json('wrong credentials'))
}

module.exports = {
  handleSignin: handleSignin
}