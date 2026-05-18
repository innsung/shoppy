import express from 'express';
import * as controller from '../controller/return.js';

const router = express.Router();

router.get('/', controller.getReturn);

export default router;