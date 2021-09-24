const jwt = require('jsonwebtoken');
const redis = require("redis");

// Setup Redis:
const redisClient = redis.createClient({host: '127.0.0.1'});

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

const signToken = (email) => {
  const jwtPayload = { email };
  return jwt.sign(jwtPayload, 'JWT_SECRET', { expiresIn: '2 days'});
}

const setToken = (token, email) => {
  return Promise.resolve(redisClient.set(token, email))
}

const createSessions = (user) => {
  const { email } = user;
  const token = signToken(email);
  return setToken(token, email)
    .then(() => { 
      return { success: 'true', email, token }
    })
    .catch(console.log)
}

const signinAuthentication = (req, res, db) => {
  const { authorization } = req.headers;
  return authorization ? getAuthTokenId() : 
    handleSignin(req, res, db)
      .then(data => {
        return data.email ? createSessions(data) : Promise.reject(data)
      })
      .then(session => res.json(session))
      .catch(err => res.status(400).json(err))
}

module.exports = {
  signinAuthentication: signinAuthentication
}