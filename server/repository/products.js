import pool from '../db/connection.js';

/**
 * 상품 상세정보 조회
 */
export const getProduct = async(pid) => {
    const sql = `
        select  pid,
            name,
            price,
            info,
            rate,
            concat('/images/', image) as image,
            img_list as imgList
        from product where pid = ?
    `;
    const [result] = await pool.execute(sql, [pid]);
    return result[0];   
}


/**
 * 전체 상품 조회
 */
export const getAll = async() => {
    const sql = `
        select  pid,
                concat('images/', image) as image
        from product
    `;
    const [results] = await pool.execute(sql, []);
    return results;
}