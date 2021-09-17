const express = require('express');
const cors = require('cors');
const knex = require('knex');

// database
const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    port : 5432,
    user : 'ian',
    password : '',
    database : 'messaging-app'
  }
});

db.select('*').from('users');

const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello messaging-app-api');
})

app.post('/signin', (req, res) => {
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
})

app.get('/user/:id', (req, res) => {
  const { id } = req.params;
  let found = false;
  db.users.forEach(user => {
    if (user.id === id) {
      found = true;
      return res.json(user);
    }
  })
  if (!found) {
    res.status(400).json('user not found');
  }
})
 
app.listen(3000);