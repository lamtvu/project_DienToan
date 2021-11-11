const resService = require('./../services/response.service');
const authMiddleware = require('./../middlewares/auth.middle')
const jwtService = require('./../services/jwt.service')
const Tables = require('./../configs/tables.config')

module.exports = (event, callback, ddb) => {
    const build = async () => {
        try {
            const encoded = await authMiddleware.verifyToken(event);
            event.userData = encoded;
            switch (true) {
                case event.httpMethod === 'POST':
                    await createKey();
                    break;
            }
        } catch {
            callback(null, resService.buildResponse(401, { err: 'Unauthorized ' }))
        }
    }

    const createKey = async () => {
        const { username, createAt } = event.userData;
        const secretKey = process.env.SECRET_KEY;

        try {
            const key = await jwtService.generateToken({ username, createAt }, secretKey);
            const params = {
                TableName: Tables.users,
                Key: { username, createAt },
                UpdateExpression: 'set key =:key',
                ExpressionAttributeValues: {
                    ":key": key
                },
                ReturnValue: 'UPDATE_VALUE'
            };
            await ddb.update(params).promise();
            callback(null, resService.buildResponse(200, { msg: 'success', key: key }));
        } catch (e) {
            callback(null, resService.buildResponse(500, { err: 'Internal Server Error' }))
        }
    }

    return { build }
}
