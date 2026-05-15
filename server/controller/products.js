import * as repository from '../repository/products.js';

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