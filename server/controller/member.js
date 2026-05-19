import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as repository from '../repository/member.js';

/**
 * 로그인
 */
export const getLogin  = async(req, res, next) => {
    const {id, pwd} = req.body;
    const pwdHash = await repository.getPassword(id);

    try {
        if(!pwdHash) {
            res.json({"isLogin": false});
        } else {
            const isLogin = await bcrypt.compare(pwd, pwdHash.pwd);   //pwdHash = {"pwd": ~~}
            let token = '';
            if(isLogin) {
                //로그인 인증 - jwttoken
                token = await jwt.sign({id}, 'secret', {expiresIn : '7d'});
            }
            console.log('token--> ', token);
            
            res.json({isLogin, token, "role": pwdHash.role});    
        }
        
    } catch (error) {
        
    }



}



/**
 * 아이디 중복 체크
 */
export const getIdCheck = async(req, res, next) => {
    const {id} = req.body;
    const result = await repository.getIdCheck(id);
    res.json(result);  //{"isFind": 1}
}

/**
 * 회원 가입
 */
export const getSignup = async(req, res, next) => {
    const { id, pwd, name, phone, emailDomain, emailName } = req.body;
    const pwdHash = await bcrypt.hash(pwd, 10);
    const email = emailName.concat('@',emailDomain);
    const member = {...req.body, "pwdHash": pwdHash, "email": email};
    
    const result = await repository.getSignup(member);    
    res.json({"isSignup": result});
}