const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const users = require('../users.json');

const SECRET_KEY = 'your-secret-key'; // Replace with .env later

function saveUser(data) {
  fs.writeFileSync('backend/users.json', JSON.stringify(data, null, 2));
}

exports.registerUser = (req, res) => {
  const { email, password } = req.body;
  const existingUser = users.find(u => u.email === email);
  if (existingUser) return res.status(400).json({ message: 'User already exists' });

  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser = { email, password: hashedPassword };
  users.push(newUser);
  saveUser(users);

  res.status(201).json({ message: 'User registered' });
};

exports.loginUser = (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ email: user.email }, SECRET_KEY, { expiresIn: '1h' });
  res.json({ token });
};

exports.protectedRoute = (req, res) => {
  res.json({ message: 'You are authorized!', user: req.user });
};
