import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();

//Pool Conection untuk koneksi ke MYSQL;
const pool = mysql
.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  })
  .promise();

// Memastikan pool terkoneksi ke database
pool.getConnection((err, connection) => {
  if (err) {
    console.error('gagal terkoneksi ke database:', err.stack);
  } else {
    console.log('Terkoneksi ke database dengan threadId:', connection.threadId);
    connection.release();
  }
});

export { pool };