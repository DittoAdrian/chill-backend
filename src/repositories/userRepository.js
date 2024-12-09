import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { pool } from '../utils/database.js'
dotenv.config();


// get all users
export const getUsers = async () => {
  const [rows] = await pool.query("SELECT * FROM users");
  return rows;
}

// get user by id
export async function getUser(id) {
  const [rows] = await pool.query(`
        SELECT *
        FROM users
        WHERE id = ? `,
    [id]
  );
  return rows[0];
}

//get user by username
export async function getUserByUsername(username) {
  const [rows] = await pool.query(
    `
        SELECT *
        FROM users
        WHERE username = ? 
        `,
    [username]
  );
  if (rows[0]) {
    return rows[0];
  }
}

// insert user
export async function createUser(userData) {
  const { name, username, password, email } = userData;
  const query = `
        INSERT INTO users 
        (name, username, password, email)
        VALUES (?, ?, ?, ?)`;
  const value = [name,username,password,email];
  try {
    const [result] = await pool.query(query,value);
    const id = result.insertId;
    return await getUser(id);
  } catch (error) {
    throw error;
  }
}

//  patch (update) user
export async function updateUser(id, userData) {
  //array data yang ingin diupdate
  const updateFields = [];
  const updateValues = [];

  //cari data apa saja yang teradpat pada json
  if (userData.name) {
    updateFields.push("name = ?");
    updateValues.push(userData.name);
  }
  if (userData.username) {
    updateFields.push("username = ?");
    updateValues.push(userData.username);
  }
  if (userData.password) {
    updateFields.push("password = ?");
    updateValues.push(userData.password);
  }
  if (userData.email) {
    updateFields.push("email = ?");
    updateValues.push(userData.email);
  }
  if (userData.premium) {
    updateFields.push("premium = ?");
    updateValues.push(userData.premium);
  }
  if (userData.verification) {
    updateFields.push("verification = ?");
    updateValues.push(userData.verification);
  }
  if (userData.token) {
    updateFields.push("token = ?");
    updateValues.push(userData.token);
  }
  if (updateFields.length === 0) {
    throw new Error("Tidak ada data yang diupdate");
  }
  //memasukan id diahkir
  updateValues.push(id);

  const query = `
        UPDATE users 
        SET ${updateFields.join(",")}
        WHERE id = ?`;

  const [result] = await pool.query(query, updateValues);

  if (result.affectedRows > 0) {
    return getUser(id);
  } else {
    throw new Error(`User dengan ID ${id} tidak ditemukan.`);
  }
}

//delete user
export async function deleteUser(id) {
  const [result] = await pool.query(
    `
        DELETE FROM users
        WHERE id = ?
        `,
    [id]
  );
  if (result.affectedRows > 0) {
    return { message: `User dengan ID ${id} berhasil dihapus.` };
  } else {
    throw new Error(`User dengan ID ${id} tidak ditemukan.`);
  }
}

//Update Token
export async function updateToken(userData) {
  const { id, token } = userData;
  try {
    const query = `
    UPDATE users
    SET token = ?
    WHERE id = ?`;
    const value = [token, id];

    const [result] = await pool.query(query, value);
    return result;
  } catch (error) {
    throw error;
  }
}

// Register
export async function registerUser(value) {
  try {
    const query = `
            INSERT INTO users (name, username, password, email, token)
            VALUES (?, ?, ?, ?, ?)
            `;
    const [result] = await pool.query(query, value);
    const id = result.insertId;
    const newUserData = await getUser(id);

    return {
      status: 201,
      message: "data berhasil dibuat",
      data: newUserData,
    };
  } catch (error) {
      throw error;
  }
}
