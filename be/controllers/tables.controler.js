const Tables = require('./../configs/tables.config');
const routes = require('./../configs/routes.config');
const resService = require('./../services/response.service');
const authMiddleware = require('./../middlewares/auth.middle');
const paginationService = require('./../services/pagination.service');

module.exports = (event, callback, ddb) => {
    const build = async () => {
        try {
            const encoded = await authMiddleware.verifyToken(event);
            event.userData = encoded;
            switch (true) {
                case event.httpMethod === 'POST':
                    await createTable();
                    break;
                case event.httpMethod === 'GET':
                    await getTables();
                    break;
                case event.httpMethod === 'DELETE':
                    await deleteTable();
                    break;

            }
        } catch {
            callback(null, resService.buildResponse(401, { err: 'Unauthorized ' }))
        }
    }

    const createTable = async () => {
        const responseData = JSON.parse(event.body);
        const username = event.userData.username;

        //validate
        if (!responseData) {
            callback(null, resService.buildResponse(400, { err: 'tableName required' }));
        }
        if (!responseData.tableName) {
            callback(null, resService.buildResponse(400, { err: 'tableName required' }));
        }
        try {
            const data = await ddb.get({ TableName: Tables.tables, Key: { owner: username, name: responseData.tableName } }).promise();
            if (data.Item) {
                callback(null, resService.buildResponse(400, { err: 'Table name already exist' }));
                return;
            }
        } catch {
            callback(null, resService.buildResponse(500, { err: 'Internal Server Error' }));
            return;
        }

        // save table
        const params = {
            TableName: Tables.tables,
            Item: {
                name: responseData.tableName,
                owner: username,
                createAt: Date.now()
            }
        }
        try {
            await ddb.put(params).promise();
            callback(null, resService.buildResponse(200, { msg: 'success' }));
        } catch {
            callback(null, resService.buildResponse(500, { err: 'Internal Server Error' }));
        }
    }

    const getTables = async () => {
        const username = event.userData.username;
        let limit = 10, exlusiveStartKey;
        if (event.queryStringParameters) {
            limit = Number.parseInt(event.queryStringParameters.limit);
            exlusiveStartKey = event.queryStringParameters.exlusiveStartKey;
        }

        const params = {
            TableName: Tables.tables,
            KeyConditionExpression: '#owner_table = :username',
            ExpressionAttributeValues: {
                ':username': username,
            },
            ExpressionAttributeNames: {
                '#owner_table': 'owner'
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
            const data = await paginationService.performPaginatedOperation(params, ['owner', 'name'], ddb);
            callback(null, resService.buildResponse(200, { msg: 'success', data }));
        } catch (e) {
            console.log(e)
            callback(null, resService.buildResponse(500, { err: 'Internal Server Error' }));
        }
    }

    const deleteTable = async () => {
        const requestBody = event.body;
        const username = event.userData.username;
        const tableName = requestBody.tableName;

        if (!tableName) {
            callback(null, resService.buildResponse(400, { err: 'required tableName' }));
            return;
        }

        const params = {
            TableName: Tables.tables,
            Key: {
                'owner': username,
                'name': tableName
            }
        }

        try {
            await ddb.delete(params).promise();
            await removeDataByTable(username, tableName);
            callback(null, resService.buildResponse(200, { msg: 'success' }));
        } catch(e) {
            console.log(e)
            callback(null, resService.buildResponse(500, { err: 'Internal Server Error' }));
        }
    }

    const removeDataByTable = async (username, tableName) => {
        const params = {
            TableName: Tables.data,
            FilterExpression: "tableName = :tbn",
            ExpressionAttributeValues: {
                ":tbn": username + ':' + tableName,
            },
        };

        const getItems = async (lastKey, items) => {
            if (lastKey) params.ExclusiveStartKey = lastKey;
            let resp = await ddb.scan(params).promise().catch(e=>{throw new Error(e)});
            items = resp.Items.length
                ? items.concat(resp.Items.map((x) => x))
                : items;
            if (resp.LastEvaluatedKey)
                return await getItems(resp.LastEvaluatedKey, items);
            else return items;
        };

        const ids = await getItems(null, []);
        const idGroups = [];

        for (var i = 0; i < ids.length; i += 25) {
            idGroups.push(ids.slice(i, i + 25));
        }

        for (let gs of idGroups) {
            let delReqs = [];
            for (let item of gs) {
                delReqs.push({ DeleteRequest: { Key: { tableName:item.tableName, _id: item._id } } });
            }
            const RequestItems = {};
            RequestItems[Tables.data] = delReqs;
            const d = await ddb
                .batchWrite({
                    RequestItems,
                })
                .promise()
                .catch((e) => {throw new Error(e)});
        }
    }

    return { build }
}