import { Button, Checkbox, FormControlLabel, TextField } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import Swal from "sweetalert2";
import { ScaleLoader } from "react-spinners";
import Box from "@mui/material/Box";

const useStyles = makeStyles({
  root: {
    height: "600px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EEEEEE",
  },
  title: {
    fontSize: "25px",
    fontWeight: "bold",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "300px",
    padding: "10px",
  },
  submit: {
    marginTop: "10px",
  },
  link: {
    marginLeft: "200px",
  },
  remember: {
    width: "300px",
  },
  loginBox: {
    width: "400px",
    height: "400px",
    border: "1px solid white",
    backgroundColor: "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    borderRadius: "20px",
  },
  // Loader
  loaderBox: {
    display: "inline-block",
    zIndex: "100",

    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%,-50%)",
  },
  loaderRoot: {
    opacity: 0.5,
  },
});
const schema = yup.object().shape({
  username: yup.string().required("Tên tài khoản đang trống !"),
  password: yup.string().required("Mật khẩu đang trống !"),
});
const Login = () => {
  const classes = useStyles();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, errors } = useForm({
    mode: "onBlur",
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    setLoading(true);
    axios({
      url: `https://k9ilwv1dvj.execute-api.us-east-1.amazonaws.com/cloudbe/auth`,
      method: "POST",
      data,
    })
      .then((result) => {
        console.log(result.data);
        setLoading(false);
        Swal.fire({
          icon: "success",
          title: "Login Successfull",
        });
        localStorage.setItem("user", JSON.stringify(result.data));
        history.replace("/dashboard");
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };
  const handleEnterKey = (e) => {
    if (e.key === "Enter") onSubmit(e);
  };
  return (
    <>
      <Box className={classes.loaderBox}>
        <ScaleLoader
          color="#f50057"
          loading={loading}
          height={45}
          width={5}
          radius={10}
          margin={4}
        />
      </Box>
      <div className={`${classes.root} ${loading ? classes.loaderRoot : null}`}>
        <div className={classes.loginBox}>
          <lable className={classes.title}>ĐĂNG NHẬP</lable>
          <form
            className={classes.form}
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            onKeyDown={handleEnterKey}
          >
            <TextField
              variant="outlined"
              margin="dense"
              required
              fullWidth
              id="username"
              label="Tên tài khoản"
              name="username"
              autoComplete="username"
              {...register("username", {
                required: "Required",
              })}
              error={!!errors?.username}
              helperText={errors?.username?.message}
            />
            <TextField
              variant="outlined"
              margin="dense"
              required
              fullWidth
              name="password"
              label="Mật Khẩu"
              type="password"
              id="password"
              autoComplete="password"
              {...register("password", {
                required: "Required",
              })}
              error={!!errors?.password}
              helperText={errors?.password?.message}
            />
            <FormControlLabel
              className={classes.remember}
              control={<Checkbox value="remember" color="success" />}
              label="Nhớ mật khẩu"
            />
            <Button
              className={classes.submit}
              variant="contained"
              color="success"
              type="submit"
              onKeyDown={handleEnterKey}
            >
              Đăng nhập
            </Button>
          </form>
          <Link className={classes.link} to="/signup">
            Chưa có tài khoản
          </Link>
        </div>
      </div>
    </>
  );
};

export default Login;
