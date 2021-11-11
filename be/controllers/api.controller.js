const resService = require('./../services/response.service');
const authMiddleware = require('./../middlewares/auth.middle')
const jwtService = require('./../services/jwt.service');
const Tables = require('./../configs/tables.config');
const crypto = require('crypto');

module.exports = (event, callback, ddb) => {
    const build = async () => {
        try {
            const { method, key } = event.queryStringParameters;
            const secretKey = process.env.SECRET_KEY;
            const decoded = await jwtService.verifyToken(key, secretKey);
            event.userData = decoded;
            switch (true) {
                case event.httpMethod === 'POST' && method === 'get':
                    await apiGetData();
                    break;
                case event.httpMethod === 'POST' && method === 'create':
                    await apiCreateData();
                    break;
                case event.httpMethod === 'DELETE':
                    await apiDeleteData();
                    break;
                case event.httpMethod === 'PUT':
                    await apiUpdateData();
                    break;
            }
        } catch {
            callback(null, resService.buildResponse(401, { err: 'invalid key' }))
        }
    }
    const apiCreateData = async () => {
        const username = event.userData.username;
        const { TableName, Item } = JSON.parse(event.body);

        if (!TableName) {
            callback(null, resService.buildResponse(400, { err: 'tablename required' }));
            return;
        }

        const params = {
            TableName: Tables.data,
            Item: {
                tableName: username + ':' + TableName,
                _id: crypto.randomUUID(),
                ...Item
            }
        }

        try {
            const response = await ddb.query(params).promise();
            callback(resService.buildResponse(200, { response }));
        } catch (err) {
            callback(resService.buildResponse(400, { err }));
        }
    }


    const apiGetData = async () => {
        const username = event.userData.username
        const { TableName,
            ProjectionExpression,
            FilterExpression,
            ExpressionAttributeNames,
            ExpressionAttributeValues,
            Limit,
            ExclusiveStartKey } = JSON.parse(event.body);

        if (!TableName) {
            callback(null, resService.buildResponse(400, { err: 'tablename required' }));
            return;
        }

        const _FilterExpression = FilterExpression ? ` and ${FilterExpression}` : '';

        const params = {
            TableName: Tables.data,
            ProjectionExpression: ProjectionExpression,
            FilterExpression: '#tableName = :tableName' + _FilterExpression,
            ExpressionAttributeNames: {
                '#tableName': 'tableName',
                ...ExpressionAttributeNames
            },
            ExpressionAttributeValues: {
                ':tableName': username + ':' + TableName,
                ...ExpressionAttributeValues
            },
            Limit,
            ExclusiveStartKey
        }

        try {
            const response = await ddb.scan(params).promise();
            callback(null, resService.buildResponse(200, { response }));
        } catch (err) {
            callback(null, resService.buildResponse(400, { err }));
        }
    }

    const apiUpdateData = async () => {
        const username = event.userData.username

        const {
            TableName,
            Key,
            UpdateExpression,
            ExpressionAttributeValues,
            ReturnValues,
        } = JSON.parse(event.data);

        if (!TableName) {
            callback(null, resService.buildResponse(400, { err: 'tablename required' }));
            return;
        }

        const params = {
            TableName: Tables.data,
            Key: {
                tableName: username + ':' + TableName,
                ...Key
            },
            UpdateExpression,
            ExpressionAttributeValues,
            ReturnValues
        }

        try {
            const response = await ddb.update(params).promise();
            callback(null, resService.buildResponse(200, { response }));
        } catch (err) {
            callback(null, resService.buildResponse(400, { err }));
        }
    }

    const apiDeleteData = async () => {
        const username = event.userData.username

        const {
            TableName,
            Key,
            ConditionExpression,
            ExpressionAttributeValues
        } = JSON.parse(event.body);

        if (!TableName) {
            callback(null, resService.buildResponse(400, { err: 'tablename required' }));
            return;
        }

        const params = {
            TableName: Tables.data,
            Key: {
                tableName: username + ':' + TableName,
                ...Key
            },
            ConditionExpression,
            ExpressionAttributeValues
        }

        try {
            const response = await ddb.delete(params).promise();
            callback(null, resService.buildResponse(200, { response }));
        } catch (err) {
            callback(null, null, resService.buildResponse(400, { err }));
        }
    }
    return { build }
}