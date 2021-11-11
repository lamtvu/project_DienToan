const Tables = require('./../configs/tables.config');
const routes = require('./../configs/routes.config');
const resService = require('./../services/response.service');
const authMiddleware = require('./../middlewares/auth.middle');
const paginationService = require('./../services/pagination.service');
const crypto = require('crypto');

module.exports = (event, callback, ddb) => {

    const build = async () => {
        try {
            const encoded = await authMiddleware.verifyToken(event);
            event.userData = encoded;
            switch (true) {
                case event.httpMethod === 'GET':
                    await getData();
                    return;
                case event.httpMethod === 'PUT':
                    await changeData();
                    return;
                case event.httpMethod === 'POST':
                    await createData();
                    return;
                case event.httpMethod === 'DELETE':
                    await deleteData();
                    return;
            }
        } catch {
            callback(null, resService.buildResponse(401, { err: 'Unauthorized ' }))
        }
    }

    const createData = async () => {
        const username = event.userData.username;
        const { tableName, item } = JSON.parse(event.body);
        //validate
        if (!tableName) {
            callback(null, resService.buildResponse(400, { err: 'tablename required' }));
            return;
        }
        if (!item) {
            callback(null, resService.buildResponse(400, { err: 'item required' }));
            return;
        }
        try {
            const existTable = await checkExistTable(username, tableName);
            if (!existTable)
                callback(null, resService.buildResponse(400, { msg: 'tableName dose not exist' }));
        } catch (e) {
            console.log(e)
            callback(null, resService.buildResponse(500, { err: 'Internal Server Error' }));
        }

        //save
        const params = {
            TableName: Tables.data,
            Item: {
                tableName: username + ':' + tableName,
                _id: crypto.randomUUID(),
                ...item,
            }
        }

        try {
            await ddb.put(params).promise();
            callback(null, resService.buildResponse(200, { msg: 'success' }));
        } catch {
            callback(null, resService.buildResponse(500, { err: 'Internal Server Error' }));
        }
    }

    const changeData = async () => {
        const username = event.userData.username;
        const { tableName, item } = JSON.parse(event.body);
        //validate
        if (!tableName) {
            callback(null, resService.buildResponse(400, { err: 'tablename required' }));
            return;
        }
        if (!item || Object.keys(item).length === 0) {
            callback(null, resService.buildResponse(400, { err: 'item required' }));
            return;
        }

        try {
            const existTable = await checkExistTable(username, tableName);
            if (!existTable)
                callback(null, resService.buildResponse(400, { msg: 'tableName dose not exist' }));
        } catch (e) {
            console.log(e)
            callback(null, resService.buildResponse(500, { err: 'Internal Server Error' }));
        }

        //
        let updateExpression = 'set ';
        Object.keys(item).forEach(key => {
            if (key != 'tableName' && key != '_id')
                updateExpression += `#${key} = :${key},`;
        })
        updateExpression = updateExpression.slice(0, -1);

        let expressionAttributeValues = {};
        Object.keys(item).forEach(key => {
            if (key != 'tableName' && key != '_id')
                expressionAttributeValues = {
                    ...expressionAttributeValues, [`:${key}`]: item[key]
                }
        })

        let expresstionAttributeNames = {};
        Object.keys(item).forEach(key => {
            if (key != 'tableName' && key != '_id')
                expresstionAttributeNames = {
                    ...expresstionAttributeNames, [`#${key}`]: key
                }
        })


        const params = {
            TableName: Tables.data,
            Key: { tableName: username + ':' + tableName, _id: item._id },
            UpdateExpression: updateExpression,
            ExpressionAttributeValues: expressionAttributeValues,
            ExpressionAttributeNames: expresstionAttributeNames
        }

        try {
            await ddb.update(params).promise();
            callback(null, resService.buildResponse(200, { msg: 'success' }));
        } catch (e) {
            callback(null, resService.buildResponse(500, { err: 'Internal Server Error', e }));
        }
    }

    const deleteData = async () => {
        const username = event.userData.username;
        const { tableName, _id } = JSON.parse(event.body);
        if (!tableName) {
            callback(null, resService.buildResponse(400, { msg: 'tableName required' }));
            return
        }
        if (!_id) {
            callback(null, resService.buildResponse(400, { msg: '_id required' }));
            return;
        }

        try {
            const existTable = await checkExistTable(username, tableName);
            if (!existTable)
                callback(null, resService.buildResponse(400, { msg: 'tableName dose not exist' }));
        } catch (e) {
            console.log(e)
            callback(null, resService.buildResponse(500, { err: 'Internal Server Error' }));
        }

        const params = {
            TableName: Tables.data,
            Key: { tableName: username + ':' + tableName, _id: _id },
        }

        try {
            await ddb.delete(params).promise();
            callback(null, resService.buildResponse(200, { msg: 'success' }));
        } catch (e) {
            callback(null, resService.buildResponse(500, { err: 'Internal Server Error', e }));
        }
    }

    const getData = async () => {
        const username = event.userData.username;
        let limit = 10, exlusiveStartKey, tableName;
        if (event.queryStringParameters) {
            limit = Number.parseInt(event.queryStringParameters.limit) || 10;
            exlusiveStartKey = event.queryStringParameters.exlusiveStartKey;
            tableName = event.queryStringParameters.tableName;
        }

        if (!tableName) {
            callback(null, resService.buildResponse(400, { msg: 'tableName required' }));
            return;
        }

        try {
            const existTable = await checkExistTable(username, tableName);
            if (!existTable)
                callback(null, resService.buildResponse(400, { msg: 'tableName dose not exist' }));
        } catch (e) {
            console.log(e)
            callback(null, resService.buildResponse(500, { err: 'Internal Server Error' }));
        }

        const params = {
            TableName: Tables.data,
            KeyConditionExpression: '#tableName = :tableName',
            ExpressionAttributeValues: {
                ':tableName': username + ':' + tableName,
            },
            ExpressionAttributeNames: {
                '#tableName': 'tableName'
            },
            Limit: limit,
        }

        if (exlusiveStartKey) {
            let keyValues = exlusiveStartKey.toString().split(",");
            if (keyValues.length === 2) {
                params.ExclusiveStartKey = {
                    owner: keyValues[0],
                    name: keyValues[1],
                };
            }
        }

        try {
            const data = await paginationService.performPaginatedOperation(params, ['tableName', '_id'], ddb);
            callback(null, resService.buildResponse(200, { msg: 'success', data }));
        } catch (e) {
            console.log(e)
            callback(null, resService.buildResponse(500, { err: 'Internal Server Error' }));
        }
    }

    const checkExistTable = async (username, tableName) => {
        try {
            const data = await ddb.get({ TableName: Tables.tables, Key: { owner: username, name: tableName } }).promise();
            if (data.Item) {
                return true;
            }
            return false
        } catch (err) {
            throw new Error(err);
        }

    }

    return {
        build
    }
}