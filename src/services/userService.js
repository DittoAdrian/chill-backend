import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
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
  registerUser,
  getVerifCode,
  UpdateVerifikasi
} from "../repositories/userRepository.js";

const sendVerification = async (code, email) => {
  const message = `Kode Verivikasi untuk aktivasi akun kamu adalah : ${code}`;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const mailOptions = {
      from: '"Chill Movie" <chillmovie2024@gmail.com>',
      to: email,
      subject: "Kode Verifikasi",
      text: message,
    };

    const sendMail = await transporter.sendMail(mailOptions);
    console.log("Email berhasil dikirim:", sendMail.messageId);
    return { success: true, messageId: sendMail.messageId };
  } catch (error) {
    console.error("Gagal mengirim email:", error);
    return { success: false, error: error.message };
  }
};

export const testingMailer = async () => {
  const result = await sendVerification();
  console.log("Hasil pengiriman email:", result);
};

// ========== CRUD ==========
export const serviceGetUsers = async () => {
  return await getUsers();
};
export const serviceGetUser = async (id) => {
  return await getUser(id);
};
export const serviceCreateUser = async (userData) => {
  return await createUser(userData);
};
export const serviceUpdateUser = async (id, userData) => {
  return await updateUser(id, userData);
};
export const serviceDeleteUser = async (id) => {
  return await deleteUser(id);
};

// ========== Login ==========
export const serviceLoginUser = async (userData) => {
  const { username, password } = userData;
  // Cek Kelengkapan Data
  if (!username || !password) {
    return {
      status: 400,
      message: "Masukkan data dengan lengkap!",
    };
  }
  try {
    // Cek Username
    const resultUname = await getUserByUsername(username);
    if (!resultUname) {
      return {
        status: 401,
        message: "Username atau password salah.",
      };
    }
    // Cek Verifikasi
    if (!resultUname.verification) {
      return {
        status: 403,
        message: "Tidak dapat login, Akun belum terverivikasi",
      };
    }
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
    } else {
      return {
        status: 401,
        message: "Username atau password salah.",
      };
    }
  } catch (error) {
    console.error("Login Error:", error);
    throw error;
  }
};

// ========== Register ==========
export const serviceRegisterUser = async (userData) => {
  const { name, username, password, email } = userData;
  // Cek kelengkapan data yang dimasukan user
  if (!name || !username || !password || !email) {
    return {
      status: 400,
      message: "Masukkan data dengan lengkap!",
    };
  }
  try {
    // Cari Username
    const resultUname = await getUserByUsername(username);
    if (resultUname) {
      return {
        status: 409,
        message: "Username sudah digunakan",
      };
    }
    // Hash Password
    const hashPass = await bcrypt.hash(password, 12);

    // Generate Token for User
    const payload = {
      username: username,
      role: "user",
    };
    const secret = process.env.SECRET_KEY;
    const timeExp = 60 * 60 * 2;
    const token = jwt.sign(payload, secret, { expiresIn: timeExp });

    // Generate Verification Code
    const rndmNum = () => Math.floor(Math.random() * 9);
    const code = `${rndmNum()}${rndmNum()}${rndmNum()}${rndmNum()}${rndmNum()}${rndmNum()}`;
    const verifCode = await bcrypt.hash(code, 12);

    const mailer = await sendVerification(code, email);
    console.log(mailer);

    const value = [name, username, hashPass, email, token];
    return await registerUser(value, verifCode);
  } catch (error) {
    throw error;
  }
};


// ========== Verifikasi ==========
export const serviceVerificationUser = async(userData) => {
  const {username, password, verificationCode} = userData;

  // Cek kelengkapan Data
  if (!username || !password || !verificationCode) {
    return {
      status: 400,
      message: "Masukkan data dengan lengkap!",
    };
  };

  try{
    //Cek Username
    const resultUname = await getUserByUsername(username);
    if (!resultUname) {
      return {
        status: 401,
        message: "Username atau password salah.",
      };
    };

    // Compare Password
    const isMatch = await bcrypt.compare(password, resultUname.password);
    if (!isMatch){
      return {
        status: 401,
        message: "Username atau password salah.",
      };
    }

    // Mengambil Code Verifikasi
    const getCode = await getVerifCode(resultUname.id);
    if (!getCode) {
      return {
        status: 401,
        message: "Akun tidak memiliki kode Verifikasi, lakukan kirim ulang kode Verifikasi"
      };
    };

    //Compare Code dengan code di dalam database
    const codeMatch = await bcrypt.compare(verificationCode, getCode);
    if(codeMatch){
      const result = await UpdateVerifikasi(resultUname.id);
      console.log(result)
      return {
        status: 201,
        message: "Akun berhasil terverivikasi",
        result : result
      }
    }
    else{
      return {
        status: 403,
        message: "Kode Salah"
      }
    };
  }
  catch(error){
    throw error
  }

}