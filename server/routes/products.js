import express from 'express';
import * as controller from '../controller/products.js';

const router = express.Router();

router.get('/', controller.getAll);
router.get('/:pid', controller.getProduct);
router.get('/qna/:pid',controller.getQna);
// router.get('/review', controller.getProductReview);


export default router;