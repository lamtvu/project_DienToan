const { SHA256 } = require('crypto-js');
const routes = require('./../configs/routes.config')
const tokenConfig = require('./../configs/token.config')
const tables = require('./../configs/tables.config')
const jwtService = require('./../services/jwt.service');
const resService = require('./../services/response.service');

module.exports = (event, callback, ddb) => {
    const build = async () => {
        switch (true) {
            case event.httpMethod === 'POST':
                await login();
                break;
        }
    }

    const login = async () => {
        const requestBody = JSON.parse(event.body);
        const { username, password } = requestBody;
        const params = {
            TableName: tables.users,
            KeyConditionExpression: 'username = :username',
            ExpressionAttributeValues: {
                ':username': username
            }
        }

        await ddb.query(params).promise().then( async (data) => {
            if (data.Count === 0) {
                callback(null, resService.buildResponse(400, { err: 'invalid username or password' }))
                return;
            }
            const users = data.Items;
            if (users[0].password !== SHA256(password).toString()) {
                callback(null, resService.buildResponse(400, { err: 'invalid password' }))
                return;
            }
            const secretKey = process.env.SECRET_KEY || tokenConfig.SECRET_KEY;
            const tokenLife = process.env.TOKEN_LIFE || tokenConfig.TOKEN_LIFE;

            const token = await jwtService.generateToken(users[0], secretKey, tokenLife);
            callback(null, resService.buildResponse(200, { msg: 'success', token: token, role: users.role }));
        }).catch(err => {
            console.log(err)
            callback(null, resService.buildResponse(500, { err: 'Internal Server Error' }))
        })
    }

    return {
        build
    }
}
