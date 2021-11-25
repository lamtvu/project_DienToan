import React from "react";

const Document = () => {
  return (
    <div style={{ padding: "25px" }}>
      <div>
        <a href="https://docs.aws.amazon.com/dynamodb/">
          Amazon DynamoDB Documentation
        </a>
      </div>
      <div>
        <h4>Method: POST </h4>
        <div>
          <p>
            URL:
            https://k9ilwv1dvj.execute-api.us-east-1.amazonaws.com/cloudbe/api?method=create&key=....
          </p>
          <p>
            &#123; <br /> TableName:"name of table", <br />{" "}
            Item:&#123;"name":"...", "age": "18" &#125; <br />
            &#125;
          </p>
        </div>
      </div>
      <div>
        <h4>Method: PUT</h4>
        <div>
          <p>
            URL:
            https://k9ilwv1dvj.execute-api.us-east-1.amazonaws.com/cloudbe/api?key=....
          </p>
          <p>
            &#123; <br />
            TableName: "name of table",
          </p>
          <p style={{ paddingLeft: "10px" }}>
            Key: <br />
            &#123;
            <br /> "_id":"......."
            <br />
            &#125;,
          </p>
          <p>UpdateExpression: "set #name=:name",</p>
          <p>ExpressionAttributeNames:&#123; "#name" : "name", &#125;</p>
          <p>
            ExpressionAttributeValues:&#123; ":name" : "new name" &#125ss;
            <br />
            &#125;
          </p>
        </div>
      </div>
      <div>
        <h4>Method: DELETE</h4>
        <div>
          <p>
            URL:
            https://k9ilwv1dvj.execute-api.us-east-1.amazonaws.com/cloudbe/api?key=....
          </p>
          <p>
            &#123;
            <br />
            TableName: "name of table",
          </p>
          <p>
            Key: "_id",
            <br />
            &#125;
          </p>
        </div>
      </div>
      <div>
        <h4>GET DATA</h4>
        <div>
          <p>
            URL:
            https://k9ilwv1dvj.execute-api.us-east-1.amazonaws.com/cloudbe/api?method=get&key=....
          </p>
          <p>
            &#123; <br />
            TableName: "name of table",
          </p>
          <p>ProjectionExpression: "#id, #name",</p>
          <p>FilterExpression: "#age = :yyyy",</p>
          <p>
            ExpressionAttributeNames:&#123; "#id" : "_id", "#name":"name",
            "#age":"age"&#125;,
          </p>
          <p>
            ExpressionAttributeValues: &#123;":yyyy" : "2000" &#125;,
            <br />
            &#125;
          </p>
        </div>
      </div>
    </div>
  );
};

export default Document;
