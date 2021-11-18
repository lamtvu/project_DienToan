import React from "react";

const Document = () => {
  return (
    <div style={{ padding: "25px" }}>
      <div>
        <h4>Method: POST</h4>
        <div>
          <p>
            URL:
            https://k9ilwv1dvj.execute-api.us-east-1.amazonaws.com/cloudbe/api?method=create&key=....
          </p>
          <p>TableName:"name of table",</p>
          <p>Item:....,</p>
        </div>
      </div>
      <div>
        <h4>Method: PUT</h4>
        <div>
          <p>
            URL:
            https://k9ilwv1dvj.execute-api.us-east-1.amazonaws.com/cloudbe/api?key=....
          </p>
          <p>TableName: "name of table"</p>
          <p>Key: "_id"</p>
          <p>UpdateExpression: "set #name=:name"</p>
          <p>ExpressionAttributeNames: "#name" : "name"</p>
          <p>ExpressionAttributeValues: ":name" : "new name"</p>
        </div>
      </div>
      <div>
        <h4>Method: DELETE</h4>
        <div>
          <p>
            URL:
            https://k9ilwv1dvj.execute-api.us-east-1.amazonaws.com/cloudbe/api?key=....
          </p>
          <p>TableName: "name of table"</p>
          <p>Key: "_id"</p>
        </div>
      </div>
      <div>
        <h4>GET DATA</h4>
        <div>
          <p>
            URL:
            https://k9ilwv1dvj.execute-api.us-east-1.amazonaws.com/cloudbe/api?method=get&key=....
          </p>
          <p>TableName: "name of table"</p>
          <p>ProjectionExpression: "#id, #name"</p>
          <p>FilterExpression: "#age = :yyyy"</p>
          <p>
            ExpressionAttributeNames: "#id" : "_id", "#name":"name",
            "#age":"age"
          </p>
          <p>ExpressionAttributeValues: ":yyyy" : "2000"</p>
        </div>
      </div>
    </div>
  );
};

export default Document;
