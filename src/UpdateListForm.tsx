import React from "react";
import { Formik, Field } from "formik";
import { mutate } from "swr";
import { TextField } from "formik-material-ui";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import axios from "axios";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import * as Yup from "yup";

import { List } from "../utils/types";
import {
  getListTitlesFromLocalStorage,
  setListInLocalStorage,
} from "../utils/localStorage";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    photoListFormPadding: {
      padding: theme.spacing(4),
    },
  })
);

const ARBITRARY_TITLE_LENGTH = 26;
const ARBITRARY_DESCRIPTION_LENGTH = 100;
export const UpdateListForm: React.FC<{
  id: List["id"];
  title: List["title"];
  description: List["description"];
  photos: List["photos"];
}> = ({ id, title, description, photos }) => {
  const existingLists = getListTitlesFromLocalStorage();
  const classes = useStyles();
  return (
    <Formik
      initialValues={{
        title: title,
        description: description,
      }}
      validationSchema={Yup.object({
        title: Yup.string()
          .max(
            ARBITRARY_TITLE_LENGTH,
            `List title must be ${ARBITRARY_TITLE_LENGTH} characters or less`
          )
          .test("no-duplicate-lists", "This list already exists", (value) => {
            if (!value) {
              return true;
            }
            return (
              existingLists.reduce<number>((acc, arrVal) => {
                if (arrVal.title === value && arrVal.id !== id) {
                  return acc + 1;
                }
                return acc;
              }, 0) < 1
            );
          })
          .trim()
          .required("Required"),
        description: Yup.string().max(
          ARBITRARY_DESCRIPTION_LENGTH,
          `List description must be ${ARBITRARY_DESCRIPTION_LENGTH} characters or less`
        ),
      })}
      onSubmit={async (values) => {
        let apiURI = `/api/list/${id}`;
        let response;
        try {
          response = await axios.patch(apiURI, {
            title: values.title,
            description: values.description,
          });
        } catch (error) {
          console.warn("Unable to update list");
        }
        if (response && response.data) {
          mutate(apiURI, {
            id,
            title: values.title,
            description: values.description,
            photos,
          });
          setListInLocalStorage({
            id: id,
            title: values.title,
            description: values.description,
          });
        }
      }}
    >
      {({ submitForm }) => (
        <Grid container item xs={12} md={4} lg={4}>
          <Grid className={classes.photoListFormPadding} item xs={12}>
            <Field
              component={TextField}
              fullWidth
              name="title"
              type="text"
              label="Title"
            />
          </Grid>
          <Grid className={classes.photoListFormPadding} item xs={12}>
            <Field
              component={TextField}
              multiline
              name="description"
              type="text"
              rows={4}
              label="Description"
              variant="outlined"
              fullWidth
            />
          </Grid>
          <Grid className={classes.photoListFormPadding} item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={submitForm}
              fullWidth
            >
              Update
            </Button>
          </Grid>
        </Grid>
      )}
    </Formik>
  );
};
