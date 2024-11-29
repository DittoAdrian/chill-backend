import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import {getUsers} from '../database.js'

// const users = await getUsers();

const router = express.Router();
const SECRET_KEY = 'secret_key'

// Register User
router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const users = await getUsers();
    const existingUser = users.find(user => user.username === username);
    if (existingUser) return res.status(400).json({ error: 'Username sudah digunakan' });
  
    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ username, password: hashedPassword });
    res.status(201).json({ message: 'User Sukses dibuat' });
  });
  
  // Login User
  router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const users = await getUsers();
    const user = users.find(user => user.username === username);
    if (!user) return res.status(404).json({ error: 'User tidak ditemukan' });
  
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ error: 'password salah' });
  
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
    res.status(200).json({ message: 'Login Berhasil', token });
  });
  
  // Protected Route
  router.get('/protected', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(403).json({ error: 'No token provided' });
  
    try {
      const decoded = jwt.verify(token, SECRET_KEY);
      res.status(200).json({ message: 'Access granted', user: decoded });
    } catch (error) {
      res.status(401).json({ error: 'Invalid token' });
    }
  });
  
  module.exports = router;