import { Button, TextField } from "@mui/material";
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
  username: yup
    .string()
    .required("Tên tài khoản đang trống !")
    .min(5, "Tên tài khoản phải từ 5 đến 16 kí tự")
    .max(16, "Tên tài khoản phải từ 5 đến 16 kí tự"),
  password: yup
    .string()
    .required("Mật khẩu đang trống !")
    .min(8, "Mật khẩu phải có ít nhất 8 kí tự")
    .max(16, "Mật khẩu chỉ tối đa 18 kí tự"),
  email: yup
    .string()
    .required("Email đang trống !")
    .email("Email không đúng định dạng"),
});
const SignUp = () => {
  const classes = useStyles();
  const history = useHistory();
  const { register, handleSubmit, errors } = useForm({
    mode: "onBlur",
    resolver: yupResolver(schema),
  });
  const [loading, setLoading] = useState(false);
  const [registerError, setregisterError] = useState(null);

  const onSubmit = (data) => {
    setLoading(true);
    axios({
      url: `https://k9ilwv1dvj.execute-api.us-east-1.amazonaws.com/cloudbe/users`,
      method: "POST",
      data,
    })
      .then((result) => {
        console.log(result.data);
        setLoading(false);
        setregisterError(null);
        Swal.fire({
          icon: "success",
          title: "Register successfull",
        });
        history.replace("/login");
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
        setregisterError(error);
      });
  };
  const handleEnterKey = (e) => {
    if (e.key === "Enter") onSubmit(e);
  };
  return (
    <>
      <Box className={classes.loader}>
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
          <lable className={classes.title}>Register Account</lable>
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
              label="Username"
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
              label="Password"
              type="password"
              id="password"
              autoComplete="password"
              {...register("password", {
                required: "Required",
              })}
              error={!!errors?.password}
              helperText={errors?.password?.message}
            />
            <TextField
              variant="outlined"
              margin="dense"
              label="Confirm password"
              type="password"
              fullWidth
            />
            <TextField
              variant="outlined"
              margin="dense"
              required
              fullWidth
              name="email"
              label="Email"
              id="email"
              autoComplete="email"
              {...register("email", {
                required: "Required",
              })}
              error={!!errors?.email}
              helperText={errors?.email?.message}
            />

            <Button
              className={classes.submit}
              variant="contained"
              color="success"
              type="submit"
              onKeyDown={handleEnterKey}
            >
              Sign up
            </Button>
          </form>
          <Link className={classes.link} to="/login">
            Already have an account
          </Link>
        </div>
      </div>
    </>
  );
};

export default SignUp;
