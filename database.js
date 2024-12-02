import mysql from 'mysql2'

import dotenv from 'dotenv'
dotenv.config()

const pool = mysql.createPool({
    host : process.env.MYSQL_HOST,
    user :  process.env.MYSQL_USER,
    password :  process.env.MYSQL_PASSWORD,
    database :  process.env.MYSQL_DATABASE
}).promise()

// get all users
export async function getUsers() {
    const [rows] = await pool.query("SELECT * FROM users")
    return rows
}

// get user by id
export async function getUser(id) {
    const [rows] = await pool.query(`
        SELECT *
        FROM users
        WHERE id = ? 
        `, [id])
    return rows[0]
}

//get user by username
export async function getUserByUsername(username){
    const [rows] = await pool.query(`
        SELECT *
        FROM users
        WHERE username = ? 
        `, [username])
    return rows[0]
}

// insert user
export async function createUser(name, username, password, email, premium, verification, token) {
    try{
        const [result] = await pool.query(`
        INSERT INTO users (name, username, password, email, premium, verification, token)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [name, username, password, email, premium || 0, verification || 0, token || ''])
            const id = result.insertId
            return getUser(id)
    }catch(error){
        throw error
    }
}

//  patch (update) user
export async function updateUser(id, userData){
    //array data yang ingin diupdate
    const updateFields = [];
    const updateValues = [];

    //cari data apa saja yang teradpat pada json
    if (userData.name){
        updateFields.push('name = ?');
        updateValues.push(userData.name);
    }if(userData.username){
        updateFields.push('username = ?');
        updateValues.push(userData.username);
    }if (userData.password){
        updateFields.push('password = ?');
        updateValues.push(userData.password);
    }if (userData.email){
        updateFields.push('email = ?');
        updateValues.push(userData.email);
    }if (userData.premium){
        updateFields.push('premium = ?');
        updateValues.push(userData.premium);
    }if (userData.verification){
        updateFields.push('verification = ?');
        updateValues.push(userData.verification);
    }if (userData.token){
        updateFields.push('token = ?');
        updateValues.push(userData.token);
    }
    if (updateFields.length === 0) {
        throw new Error('Tidak ada data yang diupdate');
    } 
    //memasukan id diahkir
    updateValues.push(id);

    const query = `
        UPDATE users 
        SET ${updateFields.join(',')}
        WHERE id = ?`;

    const [result] = await pool.query(query,updateValues);

    if (result.affectedRows > 0) {
        return getUser(id);
    } else {
        throw new Error(`User dengan ID ${id} tidak ditemukan.`);
    }
}

//  delete user
export async function deleteUser(id){
    const [result] = await pool.query(`
        DELETE FROM users
        WHERE id = ?
        `, [id])
    if (result.affectedRows > 0) {
         return { message: `User dengan ID ${id} berhasil dihapus.` };
    } else {
        throw new Error(`User dengan ID ${id} tidak ditemukan.`);
    }
}