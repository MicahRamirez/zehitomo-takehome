import React from "react";
import Grid from "@material-ui/core/Grid";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    stickySearch: {
      position: "sticky",
      top: 0,
      backgroundColor: "white",
      zIndex: 2,
      height: "100px",
      paddingTop: theme.spacing(2),
    },
  })
);

export const StickyHeader: React.FC<{
  children: React.ReactNode;
  justify: "space-evenly" | "space-between";
}> = ({ children, justify }) => {
  const classes = useStyles();
  return (
    <Grid
      className={classes.stickySearch}
      container
      justify={justify}
      alignItems="center"
    >
      {children}
    </Grid>
  );
};
