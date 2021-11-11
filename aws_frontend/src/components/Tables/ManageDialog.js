import React, { useState } from "react";
import { withStyles, makeStyles } from "@mui/styles";
import { Dialog } from "@mui/material";
import {
  DialogTitle,
  DialogActions,
  DialogContent,
  Typography,
  Button,
  TextField,
  Grid,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import axios from "axios";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { actGetTable } from "./modules/action";

const useStyles = makeStyles((theme) => ({
  form: {
    width: "100%",
    marginTop: "10px",
  },
  formControl: {
    width: "100%",
  },
  button: {
    marginRight: "8px",
  },
}));
const styles = (theme) => ({
  root: {
    margin: 0,
    padding: "10px",
  },
});
const MuiDialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <DialogTitle disableTypography className={classes.root} {...other}>
      <Typography color="secondary" variant="h6" align="center">
        {children}
      </Typography>
    </DialogTitle>
  );
});

const MuiDialogContent = withStyles((theme) => ({
  root: {
    padding: "15px",
  },
}))(DialogContent);

const MuiDialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: "10px",
  },
}))(DialogActions);

const schema = yup.object().shape({
  tableName: yup.string().required("Vui lòng nhập tên!!"),
});
export const ManageDialog = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { openDialog, setOpenDialog, handleCloseDialog, modal } = props;
  const accessToken = localStorage
    ? JSON.parse(localStorage.getItem("user"))
    : "";
  const [tableItem, setTableItem] = useState({ ...props.tableItem });
  const { register, handleSubmit, errors } = useForm({
    mode: "onBlur",
    resolver: yupResolver(schema),
  });
  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setTableItem({
      ...tableItem,
      [name]: value,
    });
  };

  const onAddSubmit = (data) => {
    axios({
      url: `https://k9ilwv1dvj.execute-api.us-east-1.amazonaws.com/cloudbe/tables`,
      method: "POST",
      data,
      headers: {
        Authorization: `Bearer ${accessToken.token}`,
      },
    })
      .then(() => {
        setOpenDialog(false);
        Swal.fire({
          icon: "success",
          title: "Tạo table thành công",
          timer: 1500,
          showConfirmButton: false,
        }).then(() => {
          dispatch(actGetTable());
        });
      })
      .catch((error) => {
        console.log(error);
        setOpenDialog(false);
      });
  };
  return (
    <div>
      <Dialog maxWidth="xs" onClose={handleCloseDialog} open={openDialog}>
        <MuiDialogTitle onClose={handleCloseDialog}>
          {modal.title}
        </MuiDialogTitle>
        <MuiDialogContent dividers>
          <form className={classes.form} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  margin="dense"
                  required
                  fullWidth
                  id="nameTable"
                  label="Name table"
                  name="tableName"
                  autoComplete="tableName"
                  {...register("tableName", {
                    required: "Required",
                  })}
                  error={!!errors?.tableName}
                  helperText={errors?.tableName?.message}
                  value={tableItem.tableName}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
          </form>
        </MuiDialogContent>
        <MuiDialogActions>
          <Button
            type="submit"
            className={classes.button}
            variant="contained"
            color="secondary"
            onClick={modal.id === "tao" ? handleSubmit(onAddSubmit) : ""}
          >
            {modal.button}
          </Button>
        </MuiDialogActions>
      </Dialog>
    </div>
  );
};
