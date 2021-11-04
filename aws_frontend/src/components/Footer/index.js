import { makeStyles } from "@mui/styles";
import React from "react";

const useStyles = makeStyles({
  root: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "25px 25px",
    height: "100px",
    backgroundColor: "#0e1a1f",
    color: "white",
  },
});
const Footer = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <lable className={classes.text}>
        Copyright 2021 | Made by student UTE
      </lable>
      <h3 className={classes.logo}>APIaws</h3>
    </div>
  );
};

export default Footer;
