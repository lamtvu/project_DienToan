function performPaginatedOperation(params, tableLastEvaluatedKeyFieldNames, ddb) {
    return new Promise((resolve, reject) => {
        const dataWithKey = {
            lastEvaluatedKey: undefined,
            result: []
        };
        // adding 1 extra items due to a corner case bug in DynamoDB, find details below.    
        const originalItemPerPageCount = params.Limit;
        params.Limit = params.Limit + 1;
        let remainingItemsCount = 0;
        // DatabaseProvider.getDocumentClient() should give us the dynamoDB DocumentClient object
        ddb.query(params).promise().then(data => {
            onScan(data);
        }).catch(err => {
            return reject(err);
        })


        function onScan(data) {
            dataWithKey.result = dataWithKey.result.concat(data.Items);
            remainingItemsCount = (originalItemPerPageCount + 1) - dataWithKey.result.length;
            if (remainingItemsCount > 0) {
                if (typeof data.LastEvaluatedKey === "undefined") {
                    // pagination done, this is the last page as LastEvaluatedKey is undefined
                    return resolve(dataWithKey);
                } else {
                    // Continuing pagination for more data
                    // as we didnot get our desired itemsPerPage. Remember ScannedCount and Count fields!!  
                    params.ExclusiveStartKey = data.LastEvaluatedKey;
                    params.Limit = remainingItemsCount;
                    ddb.query(params).promise().then(data => {
                        onScan(data);
                    }).catch(err => {
                        return reject(err);
                    })
                }
            } else {
                dataWithKey.result = dataWithKey.result.slice(0, originalItemPerPageCount);
                // pagination done, but this is not the last page. making lastEvaluatedKey to
                // send to browser
                dataWithKey.lastEvaluatedKey = prepareLastEvaluatedKeyString(
                    dataWithKey.result[originalItemPerPageCount - 1], tableLastEvaluatedKeyFieldNames);
                return resolve(dataWithKey);
            }
        }
    });
}

function prepareLastEvaluatedKeyString(dataObj, tableLastEvaluatedKeyFieldNames) {
    let key = "";
    tableLastEvaluatedKeyFieldNames.forEach((field) => {
        key += dataObj[field] + ",";
    });
    if (key !== "") {
        key = key.substr(0, key.length - 1);
    }
    return key;
}

module.exports = {
    performPaginatedOperation,
    prepareLastEvaluatedKeyString
}