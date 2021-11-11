import React from "react";
import { Box } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { makeStyles } from "@mui/styles";
import imgdatabase from "../../assets/database.jpg";
import { useSelector } from "react-redux";

const useStyles = makeStyles({
  root: {
    padding: "25px",
  },
});
const DashBoard = () => {
  const classes = useStyles();
  const listTables = useSelector(
    (state) => state.listTableReducer?.data?.data?.result
  );
  return (
    <Box className={classes.root}>
      <Card sx={{ maxWidth: 345 }}>
        <CardMedia
          component="img"
          alt="green iguana"
          height="140"
          image={imgdatabase}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            Number of tables created: {listTables?.length}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default DashBoard;
