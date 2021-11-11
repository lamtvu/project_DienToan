const jwtService = require('./../services/jwt.service');
const tokenConfig = require('./../configs/token.config');

const verifyToken = async (event) => {
    const authorization = event.headers.Authorization;
    if (!authorization) {
        throw Error('Unauthorized');
    }
    const token = authorization.split(' ')[1];
    const secretKey = process.env.SECRET_KEY || tokenConfig.SECRET_KEY;
    try {
        const encoded = await jwtService.verifyToken(token, secretKey)
        return encoded
    } catch (err) {
        throw Error('Unauthorized');
    }
}


module.exports = {
    verifyToken
}