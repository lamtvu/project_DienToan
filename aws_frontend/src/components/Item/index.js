import React, { useState, useEffect } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import TableChartIcon from "@mui/icons-material/TableChart";
import Box from "@mui/material/Box";
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
} from "@mui/material";
import { useSelector } from "react-redux";
import { makeStyles } from "@mui/styles";
import { ManageDialog } from "./ManageDialog";
import axios from "axios";
import { ScaleLoader } from "react-spinners";
import prettyFormat from "pretty-format";

const useStyles = makeStyles({
  root: {
    padding: "25px",
    display: "flex",
    justifyContent: "center",
  },
  tool: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 10px",
  },
  loaderBox: {
    display: "inline-block",
    zIndex: "100",

    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%,-50%)",
  },
  loaderRoot: {
    opacity: 0.5,
  },
});
export default function Item() {
  const [checked, setChecked] = useState([0]);
  const accessToken = localStorage
    ? JSON.parse(localStorage.getItem("user"))
    : "";
  const classes = useStyles();
  const listTables = useSelector(
    (state) => state.listTableReducer?.data?.data?.result
  );
  const [tableName, setTableName] = useState(null);
  const [item, setItem] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [listItem, setListItem] = useState([]);
  const [loading, setLoading] = useState(false);

  const getListItem = async () => {
    setLoading(true);
    axios({
      url: "https://k9ilwv1dvj.execute-api.us-east-1.amazonaws.com/cloudbe/data",
      params: { tableName: tableName },
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken.token}`,
      },
    })
      .then((res) => {
        setListItem(res?.data?.data?.result);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    getListItem();
  }, [tableName]);
  const [modal, setModal] = useState({
    title: "",
    button: "",
    id: "",
  });
  const handleAdd = () => {
    setModal({
      title: "Create Item",
      button: "Create",
      id: "tao",
    });
    setItem({});
    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleToggle = (value, tableName) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
    setTableName(tableName);
  };

  return (
    <>
      <Box className={classes.loaderBox}>
        <ScaleLoader
          color="#f50057"
          loading={loading}
          height={45}
          width={5}
          radius={10}
          margin={4}
        />
      </Box>
      <ManageDialog
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        handleCloseDialog={handleCloseDialog}
        modal={modal}
        tableName={tableName}
        item={item}
      />
      <Box className={`${classes.root} ${loading ? classes.loaderRoot : null}`}>
        <List
          component={Paper}
          sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
        >
          <div>
            <h4 className={classes.tool}>Tables</h4>
          </div>
          {listTables?.map((value, index) => {
            const labelId = `checkbox-list-label-${index}`;

            return (
              <ListItem
                key={index}
                secondaryAction={
                  <IconButton edge="end" aria-label="comments">
                    <TableChartIcon />
                  </IconButton>
                }
                disablePadding
              >
                <ListItemButton
                  role={undefined}
                  onClick={handleToggle(index, value?.name)}
                  dense
                >
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={checked.indexOf(index) !== -1}
                      tabIndex={-1}
                      disableRipple
                      inputProps={{ "aria-labelledby": labelId }}
                    />
                  </ListItemIcon>
                  <ListItemText id={labelId} primary={value?.name} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
        <TableContainer sx={{ minHeight: 300 }} component={Paper}>
          <div className={classes.tool}>
            <h4>Items</h4>
            <Button onClick={handleAdd} variant="contained" color="warning">
              Create Items
            </Button>
          </div>

          {listItem &&
            listItem.map((item, index) => {
              return (
                <div key={index}>
                  <pre>{JSON.stringify(item, null, 2)}</pre>
                </div>
              );
            })}
          {/* <Table>
            <TableHead>
              {listItem.length > 0 &&
                Object.keys(listItem[0]).map((item, index) => {
                  console.log(item);
                  console.log("listitme", listItem);
                  if (item !== "tableName") {
                    return <TableCell>{item}</TableCell>;
                  }
                })}
            </TableHead>

            
              {listItem && listItem.map((item,index)=>{
                return <div></div>
              })}
            
          </Table> */}
        </TableContainer>
      </Box>
    </>
  );
}