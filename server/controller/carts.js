import * as repository from '../repository/carts.js';

/**
 * 장바구니 아이템 삭제
 */
export const getDelete = async(req, res, next) => {
    const result = await repository.getDelete(req.body.cid);
    res.json({"isDelete": result.affectedRows});
}


/**
 * 장바구니 수량 변경
 */
export const getQtyUpdate = async(req, res, next) => {
    const { cid, type } = req.body;
    const result = await repository.getQtyUpdate(cid, type);
    res.json({"isUpdate": result.affectedRows});
}


/**
 * 고객별 장바구니 리스트 조회
 */
export const getList = async(req, res, next) => {
    const result = await repository.getList(req.body.userId);
    res.json(result);
}

/**
 * 장바구니 수량 조회
 */
export const getCount = async(req, res, next) => {
    const result = await repository.getCount(req.body.userId);  // {userId: test00}
    console.log(result);  //{count: 21}
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