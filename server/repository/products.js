import pool from '../db/connection.js';

/**
 * 상품 Qna
 */
export const getQna = async(pid) => {
    const sql = `
        select  qid,
            title,
            content,
            is_complete as isComplete,
            is_lock as isLock,
            id,
            pid,
            cdate
    from product_qna
    where pid=?
    `;
    const [rows] = await pool.execute(sql, [pid]);
    return rows;
}

/**
 * 상품 상세정보 조회
 */
export const getProduct = async(pid) => {
    const sql = `
        select  p.pid,
		p.name,
		p.price,
		p.info,
		p.rate,
		concat('/images/', p.image) as image,
		p.img_list as imgList,
		json_object(
			"title_en", pd.title_en,
			"title_ko",pd.title_ko,
			"list", pd.list
            ) as detailInfo
	from product p, product_detailinfo pd
	where p.pid = pd.pid
	and p.pid = ?
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