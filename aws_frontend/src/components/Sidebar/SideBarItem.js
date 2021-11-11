import React from "react";
import { NavLink } from "react-router-dom";
import clsx from "clsx";
import { Button, ListItem } from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  item: {
    display: "flex",
    paddingTop: 0,
    paddingBottom: 0,
  },
  button: {
    color: "#f50057",
    fontWeight: "medium",
    justifyContent: "flex-start",
    letterSpacing: 0,
    padding: "10px 8px",
    textTransform: "none",
    width: "100%",
  },
  icon: {
    marginRight: "5px",
  },
  title: {
    marginRight: "auto",
  },
  active: {
    color: "#0E1E40",
    "& $title": {
      fontWeight: "medium",
      color: "#0E1E40",
    },
    "& $icon": {
      color: "#0E1E40",
    },
  },
}));

const SideBarItem = ({ className, href, icon: Icon, title, ...rest }) => {
  const classes = useStyles();

  return (
    <ListItem
      className={clsx(classes.item, className)}
      disableGutters
      {...rest}
    >
      <Button
        activeClassName={classes.active}
        className={classes.button}
        component={NavLink}
        to={href}
      >
        {Icon && <Icon className={classes.icon} fontSize="medium" />}
        <span className={classes.title}>{title}</span>
      </Button>
    </ListItem>
  );
};

export default SideBarItem;
