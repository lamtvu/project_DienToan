# ĐỀ TÀI: Xây dựng ứng dụng trên AWS cho phép tạo database và cung cấp API để thêm,xóa sửa trên database

Nhóm 11:

Lê Hoàng Nam - 18110160

Vũ Thanh Lâm - 18110142

## Cách cài đặt sử dụng:

trước tiên clone source code từ github

### Database

- Truy cập vào **console.aws.amazon.com**, tiếp tục truy cập vào **DynamoDB**.
- Trong **Tables** chọn **Create table**, tableName là **users**, Partition key là **username**, Sort key **createAt**.
- Lặp lại thao tác tương tự để tạo các bảng: \
  **data**: Partition key là **tableName**, Sort Key là **_id** \
  **tables**: Partition key là **owner**, Sort Key là **name** 

### BackEnd

#### Lambda

- Mở thử mục github sau khi clone về, di chuyển vào thư mục be, chạy lệnh dưới để tải các package về.
---
    npm i
---
- Nén các file trong thư mục be thành file zip.
- Truy cập vào **console.aws.amazon.com**, tiếp tục truy cập vào **aws lambda** service.
- Chọn **create funtion** với fuction name là **cloudProject** (có thể đổi lại), trong tùy chọn **excution role** chọn **Create a new role with basic Lambda permissions**.
- Sau khi tạo function thành công, truy cập vào fuction chọn **code** -> **Upload form** -> .zip file và upload file zip được nén ở trên vào.
- Chọn **Configuration** -> **Environment variables** sau đó thêm các Key với value là:\
Key: SECRET_KEY, Value: 1 chuỗi base64 ngẫu nhiên
KeyTOKEN_LIFE, Value: 1d (cho thời gian sống của phiên đăng nhập là 1 ngày) 

#### API gateway

- Truy cập vào **console.aws.amazon.com**, tiếp tục truy cập vào **aws gateway** service.
- Chọn **create api**, trong Choose an API type chọn **REST API** , protocal chọn **REST**, Create new API chọn **new api**, nhập API name, Endpoint type **Regional**
- Sau khi tạo thành công, truy cập vào api vừa tạo, chọn **Action** -> create resouce, **Resource Name** là auth, tích chọn **Enable API Gateway CORS**, nhấn **create resource**
- Chọn vào resource vừ tạo, chọn **Action** -> **Create method** -> **POST**, trong setup, **Integration type** chọn **lambda fuction**, tích chọn **Use Lambda Proxy integration**, **Lambda Function** chọn **cloudProject** (hoặc tên khác nếu bạn thay đổi), chọn **save**
- Tương tự các thao tác tạo resouce, method cho các resouce và method khác sao cho giống với cấu trúc resouce sau

---
    /
    /api
        DELETE
        OPTIONS
        POST
        PUT
    /auth
        OPTIONS
        POST
    /data
        DELETE
        GET
        OPTIONS
        POST
        PUT
    /key
        OPTIONS
        POST
    /tables
        DELETE
        GET
        OPTIONS
        POST
    /users
        GET
        OPTIONS
        PATCH
        POST
        PUT

---
+ sau khi tạo thành công, chọn **Action** -> **Deploy API**, Deployment stage chọn new state, nhập stage name, chọn **deploy**
+ Trên thanh menu chọn **States** bạn sẽ thấy base url của api ở **Invoke URL**


### FrontEnd

- Mở thử mục github sau khi clone về, Mở thư mục aws_frontend bằng visual code.
- nhất tổ hợp phím **Ctrl** + **Shift** + **f**, để replace tất cả base url cũ **https://k9ilwv1dvj.execute-api.us-east-1.amazonaws.com/cloudbe** thành url bạn tạo được ở **API gateway**.
- Sự dụng câu lệnh dười để cài đặt các thư viện
---
    npm install
---
- Sư dụng câu lệnh dưới để chạy local của frontend
---
    npm start
---
- Build docker bằng câu lệnh (username là tên người dùng trên docker hub)
---
    docker build -t <username>/<imagename> .
---
- Deploy lên docker hub bằng câu lệnh (với username và imagname là username và imagename khi build)
---
    docker push <username>/<imagename>
---
- mở Ec2 truy cập vào instace, pull image vừ push lên từ trên docker hub bằng câu lênh
---
    docker pull <username>/<imagename>
---
- Run image ở port 3000 bằng câu lệnh
---
    docker run -it -p 3000:3000 <username>/<imagename>
---
- truy cập Ec2, chọn instace được sử dụng ở trên chọn **Security** -> **Security groups** -> **Edit inbound rules**, thêm rule với **port range** là **3000** cho phép mọi địa chỉ truy cập 0.0.0.0/0

