const AWS = require('aws-sdk');

const dynamo = new AWS.DynamoDB.DocumentClient();


/**
 * Provide an event that contains the following keys:
 *
 *   - operation: one of the operations in the switch statement below
 *   - tableName: required for operations that interact with DynamoDB
 *   - payload: a parameter to pass to the operation being performed
 */
exports.handler = async (event) => {
    console.log('Received event:', JSON.stringify(event, null, 2));

    const operation = event.queryStringParameters.operation;
    let payload = {};

    switch (operation) {
        case 'create':
            let body = JSON.parse(event.body);
            payload = {
                    TableName: 'notekeeper2',
                    Item: {
                        'note_content': body.note_content,
                        'note_title': body.note_title,
                        'note_time': body.note_time,
                        'user_id': body.user_id,
                        'note_id': body.note_id
                    }
                };
            let resGet = await dynamo.put(payload).promise();
            let responseGet = {
                    statusCode: 200,
                    headers: {
                        "Content-Type" : "application/json",
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Methods": "OPTIONS,POST,GET,DELETE"
                    }
                };
            return responseGet;
        case 'query':
            payload = {
                    TableName: 'notekeeper2',
                    ProjectionExpression:"#id, note_time, note_title, note_content",
                    KeyConditionExpression: "#id = :id and note_time between :time1 and :time2",
                    ExpressionAttributeNames:{
                        "#id": "user_id"
                    },
                    ExpressionAttributeValues: {
                        ":id": event.queryStringParameters.user_id,
                        ":time1": '2021-02-21T15:32:40Z',
                        ":time2": event.queryStringParameters.note_time
                    }
                };
            let resQuery = await dynamo.query(payload).promise();
            let responseQuery = {
                    statusCode: 200,
                    headers: {
                        "Content-Type" : "application/json",
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Methods": "OPTIONS,POST,GET,DELETE"
                    },
                    body: JSON.stringify(resQuery)
                };
            return responseQuery;
        case 'update':
            return await dynamo.update(payload).promise();
        case 'delete':
            payload = {
                    TableName: 'notekeeper2',
                    Key:{
                        "user_id": event.queryStringParameters.user_id,
                        "note_time": event.queryStringParameters.note_id
                    }
            }
            let resDelete = await dynamo.delete(payload).promise();
            let responseDelete = {
                    statusCode: 200,
                    headers: {
                        "Content-Type" : "application/json",
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Methods": "OPTIONS,POST,GET,DELETE"
                    }
                };
            return responseDelete;
        case 'list':
            return await dynamo.scan(payload).promise();
        case 'echo':
            return payload;
        case 'ping':
            return 'pong';
        default:
            throw new Error(`Unrecognized operation "${operation}"`);
    }
};
