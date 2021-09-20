const handleSignin = (req, res, db) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return Promise.reject('incorrect form submission');
  }
  return db.select('email', 'password').from('users')
    .where('email', '=', email)
    .then(data => {
      if (password === data[0].password) {
        return db.select('*').from('users')
          .where('email', '=', email)
          .then(user => user[0])
          .catch(err => Promise.reject('unable to get user'))
      } else {
        Promise.reject('wrong credentials')
      }
    })
    .catch(err => Promise.reject('wrong credentials'))
}

const getAuthTokenId = () => {
  console.log('auth ok');
}

const signinAuthentication = (req, res, db) => {
  const { authorization } = req.headers;
  return authorization ? getAuthTokenId() : 
    handleSignin(req, res, db)
      .then(data => res.json(data))
      .catch(err => res.status(400).json(err))
}

module.exports = {
  signinAuthentication: signinAuthentication
}