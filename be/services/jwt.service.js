const jwt = require('jsonwebtoken');

const generateToken = (userData, secretKey, tokenLife) => {
    return new Promise((resolve, reject) => {
        if (tokenLife)
            jwt.sign(userData, secretKey, { expiresIn: tokenLife }, (err, encoded) => {
                if (err) {
                    reject(err);
                }
                resolve(encoded);
            })
        else
            jwt.sign(userData, secretKey, (err, encoded) => {
                if (err) {
                    reject(err);
                }
                resolve(encoded);
            })
    })
}

const verifyToken = (token, secretKey) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secretKey, (err, decoded) => {
            if (err) {
                reject(err);
            }
            resolve(decoded);
        })
    })
}

module.exports = {
    generateToken,
    verifyToken
}