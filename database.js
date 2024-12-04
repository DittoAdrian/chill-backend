import mysql from 'mysql2'
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'
dotenv.config()

// Pool Database
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
        `, [username]);
        if (rows[0]) {
            return rows[0];
        } 
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
         return { message: `User dengan ID ${id} berhasil dihapus.`};
    } else {
        throw new Error(`User dengan ID ${id} tidak ditemukan.`);
    }
}

// Login User
export async function loginUser(userData) {
    const { username, password } = userData;
    try {
        const resultUname = await getUserByUsername(username);
        if (!resultUname) {
            return {
                status : 401,
                message : "Username atau password salah."
            };
        }

        // Cek Verifikasi
        if(!resultUname.verification){
            return {
                status : 403,
                message : "Tidak dapat login, Akun belum terverivikasi"
            };
        };

        // Compare Password
        const isMatch = await bcrypt.compare(password, resultUname.password);
        if (isMatch) {
            return {
                status : 200,
                message : "Login berhasil!"
            };
        } else {
            return {
                status: 401,
                message: "Username atau password salah."
            };
        }
    } catch (error) {
        console.error("Login Error:", error);
        throw error;
    }
}

// Register 
export async function registerUser(userData){
    const {name, username, password, email} = userData;

    // Cek kelengkapan data yang dimasukan user
    if (!name || !username || !password || !email) {
        return {
            status: 400,
            message: "Masukkan data dengan lengkap!"
        }}

    try{
        // Cari Username
        const resultUname = await getUserByUsername(username);
            if (resultUname) {
                return {
                    "status": 409,
                    "message": "Username sudah digunakan"
                };
            }
        const hashPass = await bcrypt.hash(password,12);
        // Const Token = untuk generate token
        const query =`
            INSERT INTO users (name, username, password, email, premium, verification, token)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            `
        const value = [name, username, hashPass, email, 0, 0, '']
        
        const [result] = await pool.query(query, value);
        const id = result.insertId;
        const newUserData = await getUser(id);

        return {
            "status" : 201,
            "message" : "data berhasil dibuat",
            "data" : newUserData
        }

    }catch(error){
        throw error
    }
}