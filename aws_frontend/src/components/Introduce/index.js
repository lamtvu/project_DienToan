import { makeStyles } from "@mui/styles";
import React, { useEffect } from "react";
import apiPic from "../../assets/api.png";
import lambda from "../../assets/lambda.png";
import Aos from "aos";

const useStyles = makeStyles({
  root: {
    display: "flex",
    padding: "50px",
    backgroundColor: "#EEEEEE",
  },
  textBox: {
    textAlign: "left",
  },
  title: {
    fontSize: "40px",
    fontWeight: "bold",
  },
  text: {
    lineHeight: "2.5rem",
    fontSize: "20px",
  },
  container: {
    display: "flex",
    padding: "50px",
    backgroundColor: "#EEEEEE",
  },
  imgBox2: {
    padding: "25px",
  },
});
const Introduce = () => {
  const classes = useStyles();

  useEffect(() => {
    Aos.init({ duration: 2000 });
  }, []);

  return (
    <>
      <div className={classes.root}>
        <div data-aos="fade-right" className={classes.textBox}>
          <label className={classes.title}>API là gì ?</label>
          <p className={classes.text}>
            API là các phương thức, giao thức kết nối với các thư viện và ứng
            dụng khác. Nó là viết tắt của Application Programming Interface –
            giao diện lập trình ứng dụng. API cung cấp khả năng cung cấp khả
            năng truy xuất đến một tập các hàm hay dùng. Và từ đó có thể trao
            đổi dữ liệu giữa các ứng dụng.
          </p>
        </div>
        <div data-aos="fade-left" className={classes.imgBox}>
          <img className={classes.img} src={apiPic} alt="apiPic" />
        </div>
      </div>
      <div data-aos="fade-up" className={classes.container}>
        <div className={classes.imgBox2}>
          <img src={lambda} alt="lambda" />
        </div>
        <div className={classes.textBox}>
          <label className={classes.title}>AWS Lambda</label>
          <p className={classes.text}>
            AWS Lambda là dịch vụ điện toán phi máy chủ có chức năng chạy mã của
            bạn để phản hồi các sự kiện và tự động quản lý tài nguyên điện toán
            chạy nền cho bạn. Bạn có thể sử dụng AWS Lambda để mở rộng các dịch
            vụ AWS khác bằng logic tùy chỉnh hoặc tạo những dịch vụ back-end
            hoạt động theo quy mô, hiệu năng và mức bảo mật của AWS. AWS Lambda
            có khả năng tự động chạy mã để phản hồi nhiều sự kiện, ví dụ như yêu
            cầu HTTP thông qua Amazon API Gateway, sửa đổi đối tượng trong các
            vùng lưu trữ của Amazon S3, cập nhật bảng biểu trong Amazon DynamoDB
            và chuyển đổi trạng thái trong AWS Step Functions.
          </p>
        </div>
      </div>
    </>
  );
};

export default Introduce;
