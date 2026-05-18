import bcrypt from 'bcrypt';
import * as repository from '../repository/signup.js';


export const getSignup = async(req, res, next) => {
    const { id, pwd, name, phone, emailDomain, emailName} = req.body;
    const pwdHash = await bcrypt.hash(pwd, 10);
    const email = emailName.concat('@', emailDomain);
    const member = {...req.body, "pwdHash":pwdHash, "email":email};

    const result = await repository.getSignup(member);
    res.json({"isSignup": result})
}