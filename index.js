import express from 'express'
import cors from 'cors' 
import {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    loginUser
    } from './database.js'
const app = express()


app.use(express.json())

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.options('*', cors());

// ========== CRUD ==========

//route get all Users
app.get('/users',async (req, res)=>{
    const users = await getUsers()
    res.send(users)
})

// route get user by ID
app.get('/users/:id',async (req, res)=>{
    const id = req.params.id
    const user = await getUser(id)
    res.send(user)
})

// route create user
app.post('/users', async (req, res)=>{
    const {name, username, password, email, premium, verification, token} = req.body
    const note = await createUser(name, username, password, email, premium, verification, token);
    res.status(201).send(note); 
}) 

// route Update user
app.patch('/users/:id', async (req, res)=>{
    const id = req.params.id;
    const userData = req.body;
    const note = await updateUser(id, userData);
    res.status(200).send(note);
})

// route delete user
app.delete('/users/:id',async (req, res)=>{
    const id = req.params.id
    const user = await deleteUser(id)
    res.send(user)
})


// ========== Login ==========
app.post('/login', async (req, res)=>{
    const userData = req.body;
    const data = await loginUser(userData)
    console.log(data)
    res.status(200).send(data)
});







// ========== Error Handler ==========
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
  })

// ========== Listener ==========
app.listen(3030,()=>{
    console.log('serverunning on port 3030')
})

