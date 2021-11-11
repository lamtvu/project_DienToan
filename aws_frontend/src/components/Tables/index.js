import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Button,
  TableHead,
  useTheme,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableRow,
  Box,
  TablePagination,
} from "@mui/material";

import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import { makeStyles } from "@mui/styles";
import { ManageDialog } from "./ManageDialog";
import axios from "axios";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { actGetTable } from "./modules/action";
import Breadcrumbs from "../Breadcrumbs";

const useStyles = makeStyles({
  root: {
    padding: "25px",
  },
  tools: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tableRow: {
    "&$selected, &$selected:hover": {
      backgroundColor: "purple",
    },
  },
  selected: {},
  groupBtn: {
    display: "flex",
    justifyContent: "space-between",
    width: "300px",
    height: "40px",
  },
});

function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

export default function Tables(props) {
  const accessToken = localStorage
    ? JSON.parse(localStorage.getItem("user"))
    : "";
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const classes = useStyles();
  const [tableItem, setTableItem] = useState({});
  const [openDialog, setOpenDialog] = useState(false);

  const [selectedID, setSelectedID] = useState(null);
  const [tableName, setTableName] = useState(null);
  const dispatch = useDispatch();
  const listTables = useSelector(
    (state) => state.listTableReducer?.data?.data?.result
  );

  useEffect(() => {
    dispatch(actGetTable());
  }, []);
  const deleteTable = (tableName) => {
    Swal.fire({
      icon: "question",
      title: "Delete table",
      text: "Do you really want to delete this table ?",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
    }).then((swalRes) => {
      if (swalRes.isConfirmed) {
        axios({
          url: `https://k9ilwv1dvj.execute-api.us-east-1.amazonaws.com/cloudbe/tables`,
          method: "DELETE",
          data: {
            tableName: tableName,
          },
          headers: {
            Authorization: `Bearer ${accessToken.token}`,
          },
        })
          .then((result) => {
            Swal.fire({
              icon: "success",
              title: "Delete successfull",
              showConfirmButton: false,
              timer: 1500,
            }).then(() => {
              dispatch(actGetTable());
            });
          })
          .catch((error) => {
            Swal.fire({
              icon: "error",
              title: error.response.data.msg,
              showConfirmButton: false,
              timer: 1500,
            });
          });
      }
    });
  };
  const [modal, setModal] = useState({
    title: "",
    button: "",
    id: "",
  });
  const handleAdd = () => {
    setModal({
      title: "Create Table",
      button: "Create",
      id: "tao",
    });
    setTableItem({});
    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - listTables?.length) : 0;
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <ManageDialog
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        handleCloseDialog={handleCloseDialog}
        modal={modal}
        tableItem={tableItem}
      />
      <Box className={classes.root}>
        <div className={classes.tools}>
          <h4>Tables</h4>
          <div className={classes.groupBtn}>
            <Button onClick={handleAdd} variant="contained" color="warning">
              Create tables
            </Button>
            <Button
              onClick={() => deleteTable(tableName)}
              variant="contained"
              color="secondary"
            >
              Delete
            </Button>
          </div>
        </div>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
            <TableHead>
              <TableCell>Owner</TableCell>
              <TableCell>Name Table</TableCell>
              <TableCell>Create At</TableCell>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0
                ? listTables?.slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )
                : listTables
              )?.map((row, index) => (
                <TableRow
                  key={index}
                  onClick={() => {
                    setTableName(row.name);
                    setSelectedID(index);
                  }}
                  hover
                  selected={selectedID === index}
                  classes={{ selected: classes.selected }}
                  className={classes.tableRow}
                >
                  <TableCell style={{ width: 160 }} align="left">
                    {row.owner}
                  </TableCell>
                  <TableCell style={{ width: 160 }} align="left">
                    {row.name}
                  </TableCell>
                  <TableCell style={{ width: 160 }} align="left">
                    {new Date(row?.createAt).toDateString()}
                  </TableCell>
                </TableRow>
              ))}

              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                  colSpan={3}
                  count={listTables?.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  SelectProps={{
                    inputProps: {
                      "aria-label": "rows per page",
                    },
                    native: true,
                  }}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
}
