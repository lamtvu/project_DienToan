import { makeStyles } from "@mui/styles";
import React, { useState } from "react";
import { Route } from "react-router";
import SideBar from "../../components/Sidebar";
import TopBar from "../../components/Topbar";

const useStyles = makeStyles({
  layout: {
    paddingLeft: "260px",
    paddingTop: "50px",
  },
});
const LayoutDashboard = (props) => {
  const classes = useStyles();

  return (
    <>
      <TopBar />
      <SideBar />
      <div className={classes.layout}>{props.children}</div>
    </>
  );
};

const DashboardPage = (props) => {
  return (
    <LayoutDashboard>
      <Route
        exact={props.exact}
        path={props.path}
        component={props.component}
      />
    </LayoutDashboard>
  );
};

export default DashboardPage;
