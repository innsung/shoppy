import pool from '../db/connection.js';

export const getReturn = async() => {
    const sql = `
        select	rid,
                title,
                description,
                list
        from product_return
    `;
    const [rows] = await pool.execute(sql, []);
    return rows[0];
}