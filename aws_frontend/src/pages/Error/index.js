import React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { makeStyles } from "@mui/styles";
import errorImage from "../../assets/undraw_page_not_found_su7k.svg";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "white",
    height: "100%",
    width: "100%",
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%,-60%)",
  },
  image: {
    marginTop: 50,
    display: "inline-block",
    maxWidth: "100%",
    width: 560,
  },
  title: {
    fontSize: "40px",
    fontWeight: 600,
  },
  desc: {
    fontSize: "30px",
    fontWeight: 500,
  },
}));

const Error = () => {
  const classes = useStyles();

  return (
    <Box className={classes.root} title="404">
      <Box
        display="flex"
        flexDirection="column"
        height="100%"
        justifyContent="center"
      >
        <Container maxWidth="md">
          <Typography align="center" color="primary" className={classes.title}>
            404: The page you are looking for isn’t here
          </Typography>
          <Typography align="center" color="secondary" className={classes.desc}>
            You either tried some shady route or you came here by mistake.
            Whichever it is, try using the navigation
          </Typography>
          <Box textAlign="center">
            <img
              alt="Under development"
              className={classes.image}
              src={errorImage}
            />
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Error;
