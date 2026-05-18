import * as repository from '../repository/products.js';

/**
 * 상품 Qna
 */
export const getQna = async (req,res,next)=>{
    const qna = await repository.getQna(req.params.pid);
    res.json(qna);
    
}

/**
 * 상품 상세 정보 조회 > 리뷰
 */

export const getProductReview = async(req, res, next) => {
    console.log('상품 리뷰~');
    res.json({});
}

/**
 * 상품 상세 정보 조회
 */
export const getProduct = async(req, res, next) => {
    const product = await repository.getProduct(req.params.pid);
    res.json(product);
}

/**
 * 전체 상품 조회
 */
export const getAll = async(req, res, next) => {  
    const products = await repository.getAll();
    res.json(products);   // {"data": products}
}