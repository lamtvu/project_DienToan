const Tables = require('./../configs/tables.config')
const resService = require('./../services/response.service');
const { SHA256 } = require('crypto-js');
const authMiddleware = require('./../middlewares/auth.middle')

module.exports = (event, callback, ddb) => {
    const build = async () => {
        switch (true) {
            case event.httpMethod === 'POST':
                await register();
                break;
            case event.httpMethod === 'PUT':
                try {
                    const encoded = await authMiddleware.verifyToken(event);
                    event.userData = encoded;
                    await changePassword();
                } catch {
                    callback(null, resService.buildResponse(401, { err: 'Unauthorized ' }))
                }
                break;
            case event.httpMethod === 'GET':
                try {
                    const encoded = await authMiddleware.verifyToken(event);
                    event.userData = encoded;
                    console.log(event.userData)
                    await getUser();
                } catch {
                    callback(null, resService.buildResponse(401, { err: 'Unauthorized ' }))
                }
                break;
        }
    }

    const register = async () => {
        const requestBody = JSON.parse(event.body);
        const { username, password, email } = requestBody;

        //validate
        if (!username) {
            callback(null, resService.buildResponse(401, { err: 'username requried' }))
            return;
        }
        if (!password) {
            callback(null, resService.buildResponse(401, { err: 'password requried' }))
            return;
        }
        if (!email) {
            callback(null, resService.buildResponse(401, { err: 'email requried' }))
            return;
        }

        //checkexist username
        const getUserParam = {
            TableName: Tables.users,
            KeyConditionExpression: 'username = :username',
            ExpressionAttributeValues: {
                ':username': username
            }
        }
        try{
          const data = await ddb.query(getUserParam).promise();
          if(data.Items.length > 0){
            callback(null, resService.buildResponse(401, { err: 'username already exist' }));
            return;
          }
        }catch{
            callback(null, resService.buildResponse(500, { err: 'Internal Server Error' }));
            return;
        }

        //save user
        const params = {
            TableName: Tables.users,
            Item: {
                username,
                password: SHA256(password).toString(),
                email,
                role: 1,
                createAt: Date.now()
            }
        }

        await ddb.put(params).promise().then(() => {
            callback(null, resService.buildResponse(200, { msg: 'succcess' }));
        }).catch((err) => {
            console.log(err);
            callback(null, resService.buildResponse(500, { err: 'Internal Server Error' }));
        })
    }

    const changePassword = async () => {
        const requestBody = JSON.parse(event.body);
        const { password, oldPassword } = requestBody;

        const { username, createAt } = event.userData;

        //validator
        try {
            const user = (await ddb.get({ TableName: Tables.users, Key: { username, createAt } }).promise()).Item;
            if (SHA256(password).toString() === user.password) {
                callback(null, resService.buildResponse(400, { err: 'The password cannot be the same as old password' }));
                return;
            }
            if (SHA256(oldPassword).toString() !== user.password) {
                callback(null, resService.buildResponse(400, { err: 'invalid old password' }));
                return;
            }
        } catch {
            callback(null, resService.buildResponse(500, { err: 'Internal Server Error' }));
            return;
        }

        //update user
        const params = {
            TableName: Tables.users,
            Key: { username, createAt },
            UpdateExpression: 'set password =:pwd',
            ExpressionAttributeValues: {
                ":pwd": SHA256(password).toString()
            },
            ReturnValue: 'UPDATE_VALUE'
        };

        try {
            await ddb.update(params).promise();
            callback(null, resService.buildResponse(200, { msg: 'success' }));
        } catch (err) {
            callback(null, resService.buildResponse(500, { err: err }));
        }

    }

    const getUser = async () => {
        const { username, createAt } = event.userData;
        const params = {
            ProjectionExpression: 'username, email, createAt',
            TableName: Tables.users,
            Key: { username: username, createAt: createAt },
        };

        const data = await ddb.get(params).promise().catch((err) => {
            console.log('err', err)
            callback(null, resService.buildResponse(500, { err: 'Internal Server Error' }));
        });
        callback(null, resService.buildResponse(200, { msg: 'success', user: data.Item }));

    }

    return {
        build
    }
}