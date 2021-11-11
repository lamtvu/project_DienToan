import React from "react";
import { Typography, Breadcrumbs as MuiBreadcrumbs, Link } from "@mui/material";
import { withRouter } from "react-router-dom";

const Breadcrumbs = (props) => {
  const {
    history,
    location: { pathname },
  } = props;
  const pathnames = pathname.split("/").filter((x) => x);

  return (
    <MuiBreadcrumbs aria-label="breadcrumb">
      {pathnames.length > 0 ? (
        <Link color="inherit" onClick={() => history.push("/dashboard")}>
          Home
        </Link>
      ) : (
        <Typography>Home</Typography>
      )}
      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
        const isLast = index === pathnames.length + 1;

        return isLast ? (
          <Typography key={name}>{name}</Typography>
        ) : (
          <Link
            color="inherit"
            key={name}
            onClick={() => history.push(routeTo)}
          >
            {name}
          </Link>
        );
      })}
    </MuiBreadcrumbs>
  );
};
export default withRouter(Breadcrumbs);
