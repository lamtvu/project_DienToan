import { Button } from "@mui/material";
import Box from "@mui/material/Box";
import { makeStyles } from "@mui/styles";
import React from "react";
import apiGateway from "../../assets/aws.png";

const useStyles = makeStyles({
  root: {
    display: "flex",
    justifyContent: "space-between",
    background: "#0e1a1f",
    color: "white",
  },
  container: {
    padding: "100px",
    marginTop: "100px",
  },
  img: {
    width: "400px",
    height: "400px",
    margin: "175px 160px 75px 5px",
  },
  title: {
    fontSize: "50px",
  },
  text: {
    lineHeight: "1.5rem",
  },
});
const Banner = () => {
  const classes = useStyles();
  return (
    <Box className={classes.root}>
      <div className={classes.container}>
        <lable className={classes.title}>The Free Mock API Tool</lable>
        <p className={classes.text}>Setup free mock API endpoints seconds</p>
        <Button variant="contained" color="primary">
          Create Account
        </Button>
      </div>
      <div>
        <img className={classes.img} src={apiGateway} alt="apigateway" />
      </div>
    </Box>
  );
};

export default Banner;
