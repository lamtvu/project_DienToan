import DashboardIcon from "@mui/icons-material/Dashboard";
import SideBarItem from "./SideBarItem";
import React from "react";
import { Link as RouterLink, useHistory } from "react-router-dom";
import {
  Box,
  Button,
  Divider,
  Drawer,
  Hidden,
  List,
  Typography,
} from "@mui/material";
import Swal from "sweetalert2";
import { makeStyles } from "@mui/styles";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import ViewListIcon from "@mui/icons-material/ViewList";
import DocumentScannerIcon from "@mui/icons-material/DocumentScanner";
import TableChartIcon from "@mui/icons-material/TableChart";
import VpnKeyIcon from "@mui/icons-material/VpnKey";

const useStyles = makeStyles((theme) => ({
  desktopDrawer: {
    width: 256,
    top: 64,
    height: "calc(100% - 64px)",
  },

  //////////////////
  exitButton: {
    color: "#f50057",
    fontWeight: "bold",
    justifyContent: "flex-start",
    letterSpacing: 0,
    padding: "10px 8px",
    textTransform: "none",
    width: "100%",
  },
  exitIcon: {
    marginRight: "5px",
  },
  exitText: {
    marginRight: "auto",
  },
  exit: {
    marginTop: "200px",
  },
  title: {
    height: "64px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
}));

const SideBar = () => {
  let manage = [
    {
      href: "/dashboard",
      icon: DashboardIcon,
      title: "DashBoard",
    },
    {
      href: "/tables",
      icon: TableChartIcon,
      title: "Tables",
    },
    {
      href: "/item",
      icon: ViewListIcon,
      title: "Item",
    },
    {
      href: "/key",
      icon: VpnKeyIcon,
      title: "Key",
    },
    {
      href: "/document",
      icon: DocumentScannerIcon,
      title: "Document",
    },
  ];

  const classes = useStyles();
  const history = useHistory();

  const content = (
    <Box height="100%" display="flex" flexDirection="column">
      <Typography color="black" variant="h5" className={classes.title}>
        AWS API
      </Typography>
      <Divider />
      <Box p={2}>
        <List>
          {manage.map((item) => (
            <SideBarItem
              href={item.href}
              key={item.title}
              title={item.title}
              icon={item.icon}
            />
          ))}
        </List>
      </Box>

      <Divider />

      <Box p={2} className={classes.exit}>
        <Divider />
        <Button
          className={classes.exitButton}
          onClick={() => {
            Swal.fire({
              title: "Do you want logout ?",
              showCancelButton: true,
              confirmButtonText: `Yes`,
              cancelButtonText: "Cancel",
              icon: "question",
            }).then((result) => {
              if (result.isConfirmed) {
                Swal.fire({
                  title: "Logged out",
                  text: "Thank you for using!",
                  icon: "success",
                  timer: "1800",
                });
                localStorage.removeItem("user");
                history.replace("/home");
              }
            });
          }}
        >
          <ExitToAppIcon className={classes.exitIcon} />
          <span className={classes.exitText}> Log out</span>
        </Button>
      </Box>

      <Divider />

      <Box flexGrow={1} />
    </Box>
  );

  return (
    <>
      <Hidden mdDown>
        <Drawer
          anchor="left"
          classes={{ paper: classes.desktopDrawer }}
          open
          variant="persistent"
        >
          {content}
        </Drawer>
      </Hidden>
    </>
  );
};

export default SideBar;
