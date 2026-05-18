import express from 'express';
import * as controller from  '../controller/signup.js';

const router = express.Router();

router.post('/', controller.getSignup);

export default router;