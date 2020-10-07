import React from "react";
import { Formik, Form, Field } from "formik";
import { TextField } from "formik-material-ui";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import axios from "axios";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import * as Yup from "yup";

import { Photo } from "../utils/types";
import {
  getListTitlesFromLocalStorage,
  setListInLocalStorage,
} from "../utils/localStorage";
import { PutResponse } from "../pages/api/list";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    form: {
      display: "flex",
      flexDirection: "column",
      padding: theme.spacing(2),
    },
    formTitle: {
      textAlign: "center",
    },
    textField: {
      marginBottom: theme.spacing(2),
    },
  })
);

const ARBITRARY_TITLE_LENGTH = 26;
const ARBITRARY_DESCRIPTION_LENGTH = 100;
export const CreateListForm: React.FC<{
  photoId: Photo["id"];
  photoUrls: Photo["photoUrls"];
  onClose: () => void;
}> = ({ photoId, photoUrls, onClose }) => {
  const classes = useStyles();
  const existingLists = getListTitlesFromLocalStorage();
  console.log(existingLists);
  return (
    <Formik
      initialValues={{
        listTitle: "",
        listDescription: "",
      }}
      validationSchema={Yup.object({
        listTitle: Yup.string()
          .max(
            ARBITRARY_TITLE_LENGTH,
            `List title must be ${ARBITRARY_TITLE_LENGTH} characters or less`
          )
          .test("no-duplicate-lists", "This list already exists", (value) => {
            if (!value) {
              return true;
            }
            // when creating lists the listTitle should not already exist
            // the BE should be responsible for preventing dupes but running low on time
            return existingLists.findIndex((arrVal) => arrVal === value) === -1;
          })
          .trim()
          .required("Required"),
        listDescription: Yup.string().max(
          ARBITRARY_DESCRIPTION_LENGTH,
          `List description must be ${ARBITRARY_DESCRIPTION_LENGTH} characters or less`
        ),
      })}
      onSubmit={async (values) => {
        let response;
        try {
          response = await axios.put<PutResponse>("/api/list", {
            title: values.listTitle,
            description: values.listDescription,
            photos: [{ id: photoId, photoUrls: photoUrls }],
          });
        } catch (error) {
          console.warn("Unable to create list");
          // do error handling
        }
        if (response && response.data) {
          setListInLocalStorage({
            id: response.data.id,
            title: values.listTitle,
            description: values.listDescription,
          });
          onClose();
        }
      }}
    >
      {({ submitForm }) => (
        <Form className={classes.form}>
          <Typography variant="h5" component="h6">
            Make a new list
          </Typography>
          <Field
            component={TextField}
            name="listTitle"
            type="text"
            label="List title"
            className={classes.textField}
          />
          <Field
            component={TextField}
            multiline
            name="listDescription"
            type="text"
            rows={4}
            label="List description"
            className={classes.textField}
          />
          <Button variant={"contained"} color={"primary"} onClick={submitForm}>
            Create list
          </Button>
        </Form>
      )}
    </Formik>
  );
};
