const jwt = require('jsonwebtoken');
const { verifyJwtToken } = require('../utils/jwt');

exports.auth = {

    // 로그인 되어 있는 유저인 지 검증
    verifyAuthentication: (req, res, next) => {
        const token = req.cookies['token'];

        console.log(token)
        
        const verifyToken = verifyJwtToken(token);
        if(verifyToken.error) {
            return next();
        }
        req.userid = verifyToken.userid;
        req.nickname = verifyToken.nickname;
        return next();
    }
    
}
