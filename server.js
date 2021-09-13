const express = require('express');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

// mock database
const db = {
  users: [
    {
      id: '1',
      email: 'asdf@example.com',
      password: 'asdf'
    },
    {
      id: '2',
      email: 'fdsa@example.com',
      password: 'fdsa'
    }
  ]
}
 
app.get('/', (req, res) => {
  res.send('Hello messaging-app-api');
})

app.post('/signin', (req, res) => {
  if (req.body.email === db.users[0].email &&
      req.body.password === db.users[0].password) {
        res.send('signing in');
  } else {
    res.status(400).json('error logging in');
  }
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