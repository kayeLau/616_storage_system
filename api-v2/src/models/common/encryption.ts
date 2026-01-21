const crypto = require('crypto');

export function generateUUID(){
    return crypto.randomUUID();
}

export function hashPassword(password) {
    //加密
    let hashPassword = crypto.createHash('sha1');
    hashPassword.update(password);
    const rePassword = hashPassword.digest('hex');
    return rePassword;
}