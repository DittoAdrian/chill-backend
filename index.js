import express from 'express'
const cors = require('cors')
import {getUsers,getUser,createUser, updateUser, deleteUser} from './database.js'
const app = express()

app.use(cors({ //membolehkan Cross-Origin Resource Sharing untuk testing di local
    origin: 'http://localhost:5173'
}))
app.use(express.json())


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
    const {username, password, email} = req.body
    const note = await createUser(username, password, email)
    res.status(201).send(note);
}) 

// route update user
app.patch('/users/:id', async (req, res)=>{
    const id = req.params.id;
    const {username, password, email} = req.body
    const note = await updateUser(id, username, password, email)
    res.status(200).send(note);
})

// route delete user
app.delete('/users/:id',async (req, res)=>{
    const id = req.params.id
    const user = await deleteUser(id)
    res.send(user)
})


// erorr handler
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
  })

// listener
app.listen(3030,()=>{
    console.log('serverunning on port 3030')
})