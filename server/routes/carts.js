import express from 'express';
import * as controller from '../controller/carts.js';

const router = express.Router();

router.post('/add', controller.getAdd);
router.post('/count', controller.getCount);
router.post('/list', controller.getList);
router.put('/qty', controller.getQtyUpdate);
router.delete('/del', controller.getDelete);

export default router;