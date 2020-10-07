import React from "react";
import { Formik, Form, Field } from "formik";
import { Select } from "formik-material-ui";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import * as Yup from "yup";
import axios from "axios";

import { Photo } from "../utils/types";
import { getListObjectFromLocalStorage } from "../utils/localStorage";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    form: {
      display: "flex",
      flexDirection: "row",
      padding: theme.spacing(2),
    },
    formTitle: {
      paddingLeft: theme.spacing(2),
      marginTop: theme.spacing(2),
    },
    select: {
      marginRight: theme.spacing(3),
      display: "flex",
      flexGrow: 10,
    },
    button: {
      paddingLeft: theme.spacing(),
      display: "flex",
      flexGrow: 1,
    },
  })
);

export const QuickListAddForm: React.FC<{
  photoId: Photo["id"];
  photoUrls: Photo["photoUrls"];
  onClose: () => void;
}> = ({ photoId, photoUrls, onClose }) => {
  const classes = useStyles();
  const lists = Object.values(getListObjectFromLocalStorage());

  return (
    <Formik
      initialValues={{
        listId: "",
      }}
      validationSchema={Yup.object({
        listId: Yup.string().required("Required"),
      })}
      onSubmit={async (values) => {
        try {
          await axios.patch(`/api/list/${values.listId}`, {
            photos: {
              id: photoId,
              photoUrls,
            },
          });
        } catch (error) {
          console.error("unable to patch list");
        }
        onClose();
      }}
    >
      {({ submitForm }) => (
        <>
          <Typography className={classes.formTitle} variant="h5" component="h6">
            Add to existing list
          </Typography>
          <Form className={classes.form}>
            <Field
              className={classes.select}
              component={Select}
              name="listId"
              type="text"
              label="Lists"
            >
              {lists.map((list) => {
                return (
                  <MenuItem key={list.id} value={list.id}>
                    {list.title}{" "}
                  </MenuItem>
                );
              })}
            </Field>
            <Button
              className={classes.button}
              variant={"contained"}
              color={"primary"}
              onClick={submitForm}
              endIcon={<AddIcon>add</AddIcon>}
            >
              Add to list
            </Button>
          </Form>
        </>
      )}
    </Formik>
  );
};
