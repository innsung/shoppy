import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD ,
    database: process.env.DB_NAME || 'shoppy'
});

//DB connect test
pool.getConnection()
    .then(conn => console.log('✅ MySQL 연결 성공!!'))
    .catch((err) => console.log('❌ MySQL 연결 실패'));

export default pool;
