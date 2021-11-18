import React, { useState, useEffect } from "react";
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
  TextareaAutosize,
} from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import axios from "axios";
import Swal from "sweetalert2";

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
  item: yup.string().required("vui long nhap!!"),
});
export const ManageDialog = (props) => {
  const classes = useStyles();

  const {
    openDialog,
    setOpenDialog,
    handleCloseDialog,
    modal,
    tableName,
    getListItem,
  } = props;
  const accessToken = localStorage
    ? JSON.parse(localStorage.getItem("user"))
    : "";
  const [item, setItem] = useState({ ...props?.item });
  const { register, handleSubmit, errors } = useForm({
    mode: "onBlur",
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    setItem(props?.item);
  }, [props.item]);
  const handleChange = (event) => {
    const value = event.target.value;
    setItem(value);
  };

  const onAddSubmit = () => {
    const itemJson = JSON.parse(item);
    axios({
      url: `https://k9ilwv1dvj.execute-api.us-east-1.amazonaws.com/cloudbe/data`,
      method: "POST",
      data: {
        tableName: tableName,
        item: itemJson,
      },
      headers: {
        Authorization: `Bearer ${accessToken.token}`,
      },
    })
      .then((res) => {
        getListItem();
        setOpenDialog(false);
        Swal.fire({
          icon: "success",
          title: "Create item successfull !!!",
          timer: 1500,
          showConfirmButton: false,
        });
      })
      .catch((error) => {
        console.log(error);
        setOpenDialog(false);
      });
  };
  const onUpdate = () => {
    const itemJson = JSON.parse(item);
    axios({
      url: `https://k9ilwv1dvj.execute-api.us-east-1.amazonaws.com/cloudbe/data`,
      method: "PUT",
      data: {
        tableName: tableName,
        item: itemJson,
      },
      headers: {
        Authorization: `Bearer ${accessToken.token}`,
      },
    })
      .then((res) => {
        getListItem();
        setOpenDialog(false);
        Swal.fire({
          icon: "success",
          title: "Update successfull !!!",
          timer: 1500,
          showConfirmButton: false,
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
                <TextareaAutosize
                  variant="outlined"
                  margin="dense"
                  required
                  style={{ width: 300 }}
                  id="item"
                  minRows="10"
                  label="Item"
                  name="item"
                  autoComplete="item"
                  {...register("item", {
                    required: "Required",
                  })}
                  error={!!errors?.item}
                  helperText={errors?.item?.message}
                  value={item}
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
            onClick={
              modal.id === "tao"
                ? handleSubmit(onAddSubmit)
                : handleSubmit(onUpdate)
            }
          >
            {modal.button}
          </Button>
        </MuiDialogActions>
      </Dialog>
    </div>
  );
};
