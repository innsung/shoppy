import pool from '../db/connection.js';

/**
 * 장바구니 아이템 삭제
 */

export const getDelete = async(cid) => {
    const sql = `
        delete from cart where cid = ?
    `;
    const [rows] =await pool.execute(sql, [cid]);
    return rows;
}

/**
 * 고객별 장비구니 리스트 조회
 */
export const getList = async(userId) => {
    const sql = `
        select * from view_cartlist where id = ?
    `;
    const [rows] = await pool.execute(sql, [userId]);
    return rows;
}

/**
 * 고객별 cart 테이블 수량 조회
 */
export const getCount = async(userId) => {
    // console.log('userid:', userId);
    const sql = `select sum(qty) as count from cart where id = ?`;
    const [rows] = await pool.execute(sql, [userId]);
    return rows[0];
}

/**
 * cartItem 수량 업데이트 - 장바구니 추가, 장바구니 리스트 수량 업데이트
 */
export const getQtyUpdate = async(cid, type) => {
    const param = type === '-' ? 'qty - 1': 'qty + 1';
    
    const sql = ` update cart
                    set qty = ${param}
                    where cid = ?
    `;
    const [rows] = await pool.execute(sql, [cid]);
    return rows; // update, insert, delete = { affectedRows:1 ..}
}


/**
 * cartItem 추가
 */
export const getCartItemAdd = async(cartItem) => {
    const { pid, size, qty, userId } = cartItem;
    const sql = `
        insert into cart(size, qty, pid, id, cdate)
            values(?, ?, ?, ?, now())
    `;
    const [rows] = await pool.execute(sql, [size, qty, pid, userId]);
    return rows;
}


/**
 * cartItem 조회
 */
export const getFindItem = async(cartItem) => {
    const { pid, size, userId } = cartItem;
    const sql = `
            select cid from cart
                where pid = ? and id = ? and size= ?
    `;
    const [rows] = await pool.execute(sql, [pid, userId, size]);
    return rows[0];   //rows[0] = {cid: 100}
}