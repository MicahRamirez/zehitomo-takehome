import React, { useEffect, useState } from "react";
import Typography from "@material-ui/core/Typography";
import SearchIcon from "@material-ui/icons/Search";
import Button from "@material-ui/core/Button";
import Link from "next/link";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";

import { StickyHeader } from "../src/StickyHeader";
import {
  getListObjectFromLocalStorage,
  ListPartial,
} from "../utils/localStorage";
import { PhotoList } from "../src/PhotoList";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    headerText: {
      marginLeft: theme.spacing(3),
    },
    search: {
      marginRight: theme.spacing(3),
    },
    listContainer: {
      padding: theme.spacing(3),
    },
  })
);

export default function Index() {
  const [lists, setLists] = useState<ListPartial[]>();
  const classes = useStyles();
  useEffect(() => {
    const result = getListObjectFromLocalStorage();
    setLists(Object.values(result));
  }, []);
  return (
    <Grid container justify="center">
      <StickyHeader justify={"space-between"}>
        <Typography
          className={classes.headerText}
          variant="h3"
          component="h3"
          align="center"
        >
          Lists
        </Typography>
        <Grid className={classes.search}>
          <Link href="/">
            <Button variant="outlined" color="primary" endIcon={<SearchIcon />}>
              {" "}
              Search{" "}
            </Button>
          </Link>
        </Grid>
      </StickyHeader>
      <Grid className={classes.listContainer} container spacing={5}>
        {lists && lists.length > 0 ? (
          lists.map((list: ListPartial, i) => {
            return <PhotoList key={i} id={list.id} />;
          })
        ) : (
          <Typography>
            Oops, search and save some images to see lists here!
          </Typography>
        )}
      </Grid>
    </Grid>
  );
}
