const jwt = require('jsonwebtoken');

exports.createJwtToken = (userid, nickname) => {
    const secretKey = process.env.SECRET_JWT;
    
    try {
        const token = jwt.sign({ userid, nickname }, secretKey, {
            algorithm: "HS256", 
        })
        return token;
    } catch (error) {
        console.log(error)
        return { error }
    }
}

exports.verifyJwtToken = (token) => {
    const secretKey = process.env.SECRET_JWT;
    try {
        return jwt.verify(token, secretKey);
    } catch (error) {
        return { error };
    }
}