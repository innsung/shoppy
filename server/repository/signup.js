import pool from '../db/connection.js';

export const getSignup = async(member) => {
    console.log('repository --> ', member);
    const {id, pwdHash, name, phone, email} = member;
    const sql = `
        insert into member(id, pwd, name, phone, email, mdate)
                    values(?, ?, ?, ?, ?, curdate())
    `;
    const [rows] = await pool.execute(sql ,[id, pwdHash, name, phone, email]);
    return rows.affectedRows;
}