ĐỀ TÀI: Xây dựng ứng dụng trên AWS cho phép tạo database và cung cấp API để thêm,xóa sửa trên database
Nhóm 11:
Lê Hoàng Nam - 18110160
Vũ Thanh Lâm - 18110142

Cách cài đặt sử dụng:
- FrontEnd
 + Clone source code từ github
 + Sự dụng câu lệnh "npm install" để cài đặt các thư viện
 + Sư dụng câu lệnh "npm start" để chạy local của frontend
 + Nếu muốn deploy lên EC2:
  - sử dụng docker pull container lamtvu/awsfrontend:v2
  - Sử dụng câu lệnh chạy "docker run -it -p 3000:3000 lamtvu/awsfrontend:v2" để chạy trên máy ảo
