import {
    serviceGetUsers,
    serviceGetUser,
    serviceCreateUser,
    serviceUpdateUser,
    serviceDeleteUser,
    serviceLoginUser,
    serviceRegisterUser
 } from '../services/userService.js';


// ========== CRUD ==========

//Get All Users
export const getAllUsers = async (req, res)=>{
    try {
        const users = await serviceGetUsers();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: 'Something went wrong' });
    }
}

//Get User by ID
export const getUserById = async (req, res)=>{
    try {
        const id = req.params.id
        const userById = await serviceGetUser(id);
        res.status(200).json(userById);
    } catch (err) {
        res.status(500).json({ error: `Failed to get user with id : ${id}` });
    }
}

//Create New user
export const createNewUser = async (req, res)=>{
    try{
        const userData = req.body
        const note = await serviceCreateUser(userData);
        res.status(201).send(note);
    } catch (err){
        res.status(400).json({ error: `Failed to Create data` })
    }
}

//Update user
export const UpdateUserData = async (req, res)=>{
    const id = req.params.id;
    const userData = req.body;
    try{
        const note = await serviceUpdateUser(id, userData);
        res.status(200).send(note);
    }catch(err) {
        res.status(400).json({error : 'Failed to Update data'})
    }
}

//Delete User
export const deleteUser = async (req, res)=>{
    try{
        const id = req.params.id;
        const user = await serviceDeleteUser(id);
        res.send(user);
    } catch(err) {
        res.status().json({error : `Failed to delete user with id:${id}`})
    }
}


// ========== Login ==========
export const loginUser = async (req, res)=>{
    try{
        const userData = req.body;
        const data = await serviceLoginUser(userData)
        console.log(data)
        res.status(200).send(data)
    }catch(err){
        res.send(err)
    }
};

// ========== Register ==========
export const registerUser = async (req, res)=>{
    try{
        const userData = req.body
        const note = await serviceRegisterUser(userData);
        res.status(201).send(note);
    } catch(err){
        res.send(err)
    }
}


