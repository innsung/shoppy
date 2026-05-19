import pool from '../db/connection.js';

/**
 * 패스워드 조회
 */
export const getPassword = async(id) => {
    const sql = ` select pwd, role from member where id = ?`;
    const [rows] = await pool.execute(sql, [id]);
    return rows[0];  // {"pwd": undefinded, "role": undefinded}
}


/**
 * 아이디 중복 체크
 */
export const getIdCheck = async(id) => {
    const sql = `
        select count(id) as isFind 
            from member where id = ?
    `;
    const [rows] = await pool.execute(sql, [id]); // rows = [ {"isFind": 1} ]
    return rows[0];
}

/**
 * 회원 가입
 */
export const getSignup = async(member) => {
    const {id, pwdHash, name, phone, email} = member;
    const sql = `
        insert into member(id, pwd, name, phone, email, mdate)
                    values(?, ?, ?, ?, ?, curdate())
    `;

    const [rows] = await pool.execute(sql, [id, pwdHash, name, phone, email]);
    return rows.affectedRows;
}