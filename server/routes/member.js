import express from 'express';
import * as controller from '../controller/member.js';

const router = express.Router();

router.post('/signup', controller.getSignup);
router.post('/idCheck', controller.getIdCheck);
router.post("/login", controller.getLogin);
router.post("/logout", controller.getLogout);
router.post("/refresh", controller.getRefresh);


export default router;