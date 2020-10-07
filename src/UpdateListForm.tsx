import React from "react";
import { Formik, Form, Field } from "formik";
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

const ARBITRARY_TITLE_LENGTH = 26;
const ARBITRARY_DESCRIPTION_LENGTH = 100;
export const UpdateListForm: React.FC<{
  id: List["id"];
  title: List["title"];
  description: List["description"];
}> = ({ id, title, description }) => {
  const existingLists = getListTitlesFromLocalStorage();
  return (
    <Formik
      initialValues={{
        title: title,
        description: description,
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
            return (
              existingLists.reduce<number>((acc, arrVal) => {
                if (arrVal === value) {
                  return acc + 1;
                }
                return acc;
              }, 0) < 2
            );
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
          response = await axios.patch(`/api/list/${id}`, {
            title: values.title,
            description: values.description,
          });
        } catch (error) {
          console.warn("Unable to update list");
        }
        if (response && response.data) {
          setListInLocalStorage({
            id: response.data.id,
            title: values.title,
            description: values.description,
          });
        }
      }}
    >
      {({ submitForm }) => (
        <Grid container item xs={12} md={4} lg={4}>
          <Grid item xs={12}>
            <Field
              component={TextField}
              name="listTitle"
              type="text"
              label="List title"
            />
          </Grid>
          <Grid item xs={12}>
            <Field
              component={TextField}
              multiline
              name="listDescription"
              type="text"
              rows={4}
              label="List description"
              variant="outlined"
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
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
