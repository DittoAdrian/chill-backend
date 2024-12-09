import express from 'express'
import {
    getAllUsers, 
    getUserById,
    createNewUser,
    UpdateUserData,
    deleteUser,
    loginUser,
    registerUser
} from '../controllers/controllerUser.js'

const router = express.Router()

router.get('/users', getAllUsers);
router.get('/users/:id',getUserById);
router.post('/users', createNewUser);
router.patch('/users/:id', UpdateUserData);
router.delete('/users/:id', deleteUser);

router.post('/login', loginUser);
router.post('/register', registerUser);

export default router;