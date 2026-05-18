import * as repository from '../repository/return.js';

export const getReturn = async(req, res, next) => {
    const returnData = await repository.getReturn();
    res.json(returnData);
}