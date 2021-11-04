import React from "react";
import { makeStyles } from "@mui/styles";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";

const useStyles = makeStyles({
  root: {
    background: "#0e1a1f",
    width: "100%",
    height: "70px",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    top: "0",
    position: "fixed",
    zIndex: "999",
  },
  logo: {
    marginLeft: "75px",
  },
  link: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    listStyle: "none",
    marginRight: "100px",
  },
  li: {
    padding: "10px",
  },
  linkLi: {
    textDecoration: "none",
    color: "white",
    fontSize: "20px",

    "&:hover": {
      color: "blue",
    },
  },
  btnAuth: {
    marginRight: "25px",
    display: "flex",
    justifyContent: "space-between",
    width: "200px",
  },
});
const Header = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <div className={classes.logo}>
        <h3>APIaws</h3>
      </div>
      <div>
        <ul className={classes.link}>
          <li className={classes.li}>
            <Link to="/" className={classes.linkLi}>
              Home
            </Link>
          </li>
          <li className={classes.li}>
            <Link to="/" className={classes.linkLi}>
              About
            </Link>
          </li>
          <li className={classes.li}>
            <Link to="/" className={classes.linkLi}>
              Contact
            </Link>
          </li>
          <li className={classes.li}>
            <Link to="/" className={classes.linkLi}>
              Pricing
            </Link>
          </li>
        </ul>
      </div>
      <div className={classes.btnAuth}>
        <div>
          <Button variant="contained" color="primary">
            <Link
              style={{ textDecoration: "none", color: "white" }}
              to="/signup"
            >
              Sign up
            </Link>
          </Button>
        </div>
        <div>
          <Button variant="contained" color="success">
            <Link
              style={{ textDecoration: "none", color: "white" }}
              to="/login"
            >
              Log in
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Header;
