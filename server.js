const express = require('express');
const cors = require('cors');
const knex = require('knex');

const signin = require('./controllers/signin');

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

app.post('/signin', (req, res) => { signin.handleSignin(req, res, db) })

app.get('/user/:email', (req, res) => {
  const { email } = req.params;
})
 
app.listen(3000);