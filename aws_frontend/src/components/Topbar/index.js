import React from "react";
import { makeStyles } from "@mui/styles";
import Toolbar from "@mui/material/Toolbar";
import AppBar from "@mui/material/AppBar";
import { Avatar, Grid } from "@mui/material";
import Breadcrumbs from "../Breadcrumbs";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  appBar: {
    boxShadow: "none",
  },
  linkbar: {
    display: "flex",
    alignItems: "center",
  },
}));

export default function TopBar() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar
        position="fixed"
        style={{ background: "#6666FF" }}
        className={classes.appBar}
      >
        <Toolbar>
          <Grid container className={classes.linkbar}>
            <Grid item xs={3}></Grid>
            <Grid item xs={8}>
              <Breadcrumbs />
            </Grid>
            <Grid item xs={1}>
              <Avatar></Avatar>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    </div>
  );
}
