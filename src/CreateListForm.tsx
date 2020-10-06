import React from "react";
import { Formik, Form, Field } from "formik";
import { TextField } from "formik-material-ui";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import * as Yup from "yup";

import { Photo } from "../utils/types";

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
    submitButton: {},
  })
);

const ARBITRARY_TITLE_LENGTH = 26;
const ARBITRARY_DESCRIPTION_LENGTH = 250;
export const CreateListForm: React.FC<{
  photoId: Photo["id"];
  photoUrls: Photo["photoUrls"];
}> = ({ photoId, photoUrls }) => {
  const classes = useStyles();
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
          .required("Required"),
        listDescription: Yup.string().max(
          ARBITRARY_DESCRIPTION_LENGTH,
          `List description must be ${ARBITRARY_DESCRIPTION_LENGTH} characters or less`
        ),
      })}
      onSubmit={async (values) => {
        console.log("submitting");
        console.log(photoId, photoUrls);
        console.log(values);
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
