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
// insert user
export async function createUser(username, password, email) {
    const [result] = await pool.query(`
        INSERT INTO users (username, password, email)
        VALUES (?, ?, ?)
        `, [username, password, email])
        const id = result.insertId
        return getUser(id)
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