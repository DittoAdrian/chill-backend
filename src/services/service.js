import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

import {
    getUsers, 
    getUser, 
    createUser, 
    updateUser,
    deleteUser,
    updateToken,
    getUserByUsername,
    registerUser
} from '../repositories/userRepository.js'

// ========== CRUD ==========
export const getUsersS = async () => {
     return await getUsers();
};
export const getUserS = async (id) => {
    return await getUser(id);
};
export const createUserS = async (userData) => {
    return await createUser(userData);
};
export const updateUserS = async (id, userData) => {
    return await updateUser(id, userData);
};
export const deleteUserS = async (id) => {
    return await deleteUser(id);
};


// ========== Login ==========
export const loginUserS = async (userData) => {
    const { username, password } = userData;
    // Cek Kelengkapan Data
  if (!username || !password) {
    return {
      status: 400,
      message: "Masukkan data dengan lengkap!",
    };
  };
  try  {
    // Cek Username
    const resultUname = await getUserByUsername(username);
    if (!resultUname) {
      return {
        status: 401,
        message: "Username atau password salah.",
      };
    };
    // Cek Verifikasi
    if (!resultUname.verification) {
        return {
          status: 403,
          message: "Tidak dapat login, Akun belum terverivikasi",
        };
      };
    // Compare Password
    const isMatch = await bcrypt.compare(password, resultUname.password);
    if (isMatch) {
        //Generate Token
        const payload = {
          username: resultUname.username,
          role: resultUname.role,
        };
        const secret = process.env.SECRET_KEY;
        const timeExp = 60 * 60 * 2;
        const token = jwt.sign(payload, secret, { expiresIn: timeExp });
        //Kirim Token baru ke database (percobaaan)
        const updateTokenPayload = {
        id: resultUname.id,
        token: token,
        };
        updateToken(updateTokenPayload);
      return {
        status: 200,
        message: "Login berhasil!",
        token: token,
      };
    }
    else {
        return {
            status: 401,
            message: "Username atau password salah.",
          };
    }
  }catch(error){
    console.error("Login Error:", error);
    throw error;
  }
}


// ========== Register ==========
export const registerUserS = async (userData) => {
    const { name, username, password, email } = userData;
    // Cek kelengkapan data yang dimasukan user
    if (!name || !username || !password || !email) {
    return {
      status: 400,
      message: "Masukkan data dengan lengkap!"
    };
  };
  try {
    // Cari Username
    const resultUname = await getUserByUsername(username);
    if (resultUname) {
      return {
        status: 409,
        message: "Username sudah digunakan"
      };
    }
    //Hash Password
    const hashPass = await bcrypt.hash(password, 12);
    // Generate Token for User
    const payload = {
      username: username,
      role: "user",
    };
    const secret = process.env.SECRET_KEY;
    const timeExp = 60 * 60 * 2;
    const token = jwt.sign(payload, secret, { expiresIn: timeExp });
    const value = [name, username, hashPass, email, token];
    return await registerUser(value);
    
}catch(error){
        throw error;
    }
}