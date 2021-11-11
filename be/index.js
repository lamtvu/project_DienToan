const authController = require('./controllers/auth.controller');
const userController = require("./controllers/user.controller");
const resService = require('./services/response.service');
const AWS = require('aws-sdk');
const tablesControler = require('./controllers/tables.controler');
const dataController = require('./controllers/data.controller');
const routes = require('./configs/routes.config');
const keyController = require('./controllers/key.controller');
const apiController = require('./controllers/api.controller');
AWS.config.update({
    region: "us-east-1",
});
const ddb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, content, callback) => {
    if (event.httpMethod === "GET" && event.path === "/test") {
        resService.buildResponse(200, { msg: 'ok' });
    }
    switch (true) {
        case event.path === routes.auth:
            await authController(event, callback, ddb).build();
            break;
        case event.path === routes.users:
            await userController(event, callback, ddb).build();
            break;
        case event.path === routes.tables:
            await tablesControler(event, callback, ddb).build();
            break;
        case event.path === routes.data:
            await dataController(event, callback, ddb).build();
            break;
        case event.path === routes.key:
            await keyController(event, callback, ddb).build();
            break;
        case event.path === routes.api:
            await apiController(event, callback, ddb).build();
        default:
            callback(null, resService.buildResponse(404))
    }
};
