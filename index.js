import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {
    getUsers,
    getUser,
    getUserByUsername,
    createUser,
    updateUser,
    deleteUser,
} from './database.js';

const app = express();
const SECRET_KEY = 'secret_key'; // Ganti dengan key yang aman

app.use(express.json());

app.use(
    cors({
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    })
);
app.options('*', cors());

// Middleware untuk verifikasi token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).send('Access denied. No token provided.');

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).send('Invalid token.');
        req.user = user;
        next();
    });
};

// Route get all Users
app.get('/users', async (req, res) => {
    const users = await getUsers();
    res.send(users);
});

// Route get user by ID
app.get('/users/:id', async (req, res) => {
    const id = req.params.id;
    const user = await getUser(id);
    res.send(user);
});

// Route create user (register)
app.post('/users', async (req, res) => {
    const { username, password, email } = req.body;

    // Hash password sebelum disimpan
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await createUser(username, hashedPassword, email);
    res.status(201).send(user);
});

// Route login user
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Cari user berdasarkan username
    const user = await getUserByUsername(username); // Anda perlu menambahkan fungsi ini di database.js
    if (!user) return res.status(404).send('User not found.');

    // Bandingkan password yang diinput dengan hash di database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).send('Invalid password.');

    // Buat token JWT
    const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, {
        expiresIn: '1h',
    });
    res.send({ message: 'Login successful', token });
});

// Route update user
app.patch('/users/:id', authenticateToken, async (req, res) => {
    const id = req.params.id;
    const { username, password, email } = req.body;

    // Jika password diupdate, hash ulang
    const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

    const user = await updateUser(id, username, hashedPassword, email);
    res.status(200).send(user);
});

// Route delete user
app.delete('/users/:id', authenticateToken, async (req, res) => {
    const id = req.params.id;
    const user = await deleteUser(id);
    res.send(user);
});

// Protected route contoh
app.get('/protected', authenticateToken, (req, res) => {
    res.send(`Welcome, ${req.user.username}! You have access to this protected route.`);
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Listener
app.listen(3030, () => {
    console.log('Server running on port 3030');
});
