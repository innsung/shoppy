import * as repository from '../repository/carts.js';

/**
 * 고객별 장비구니 리스트 조회
 */

export const getList = async(req, res, next) => {
    const result = await repository.getList(req.body.userId);
    console.log(result);
    
    res.json(result);
}
/**
 * 장바구니 수량 조회
 */
export const getCount = async(req, res, next) => {
    const result = await repository.getCount(req.body.userId);
    console.log(result);
    res.json(result);
}
/**
 * 장바구니 추가
 */
export const getAdd = async(req, res, next) => {
    //카트 아이템(pid, size) 동일한 경우 : update 수량 1증가 
    //카트 아이템 없는 경우 : insert

    //1. 카트 아이템 확인  
    const findResult = await repository.getFindItem(req.body);
    let result = null;

    if(findResult) {
            result = await repository.getQtyUpdate(findResult.cid);
    } else {
            result = await repository.getCartItemAdd(req.body);
    }
    res.json({"isAdd": result.affectedRows});
}