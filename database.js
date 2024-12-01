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

export async function getUserByUsername(username){
    const [rows] = await pool.query(`
        SELECT *
        FROM users
        WHERE username = ? 
        `, [username])
    return rows[0]
}

// insert user
export async function createUser( name, username, password, email, premium, verification, token) {
    try{
        const [result] = await pool.query(`
      INSERT INTO your_table_name (name, username, password, email, premium, verification, token)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [name, username, password, email, premium || 0, verification || 0, token || ''])
            const id = result.insertId
            return getUser(id)
    }catch(error){
        throw error
    }
}

//  patch (update) user
export async function updateUser(id, username, password, email){
    const [result] = await pool.query(
        `UPDATE users 
         SET username = ?, password = ?, email = ? 
         WHERE id = ?`,
        [username, password, email, id]
    );
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