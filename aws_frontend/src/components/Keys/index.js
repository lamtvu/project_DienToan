import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Box, Table, TableRow, TableCell } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { ScaleLoader } from "react-spinners";
import Swal from "sweetalert2";

const useStyles = makeStyles({
  root: {
    padding: "25px",
  },
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
const Keys = () => {
  const accessToken = localStorage
    ? JSON.parse(localStorage.getItem("user"))
    : "";
  const [userInfo, setUserInfo] = useState([]);
  const classes = useStyles();
  const [loading, setLoading] = useState(false);

  const getUserInfo = () => {
    axios({
      url: "https://k9ilwv1dvj.execute-api.us-east-1.amazonaws.com/cloudbe/users",
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken.token}`,
      },
    })
      .then((res) => {
        setUserInfo(res?.data?.user);
        console.log(res?.data?.user);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const createKey = () => {
    setLoading(true);
    axios({
      url: `https://k9ilwv1dvj.execute-api.us-east-1.amazonaws.com/cloudbe/key`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken.token}`,
      },
    })
      .then((res) => {
        setLoading(false);
        getUserInfo();
        Swal.fire({
          icon: "success",
          title: "Create key successfull !!!",
          timer: 1500,
          showConfirmButton: false,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    getUserInfo();
  }, []);
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
      <Box className={`${classes.root} ${loading ? classes.loaderRoot : null}`}>
        <Button onClick={createKey} variant="contained" color="secondary">
          General Key
        </Button>
        <Table>
          <TableRow className={classes.row}>
            <TableCell variant="head" style={{ fontWeight: "bold" }}>
              Username
            </TableCell>
            <TableCell>{userInfo?.username}</TableCell>
          </TableRow>
          <TableRow className={classes.row}>
            <TableCell variant="head" style={{ fontWeight: "bold" }}>
              Email
            </TableCell>
            <TableCell>{userInfo?.email}</TableCell>
          </TableRow>
          <TableRow className={classes.row}>
            <TableCell variant="head" style={{ fontWeight: "bold" }}>
              Key
            </TableCell>
            <TableCell style={{ wordBreak: "break-word", width: "100%" }}>
              {userInfo?.key}
            </TableCell>
          </TableRow>
        </Table>
      </Box>
    </>
  );
};
export default Keys;
