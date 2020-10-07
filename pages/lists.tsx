import React, { useEffect, useState } from "react";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import SearchIcon from "@material-ui/icons/Search";
import Button from "@material-ui/core/Button";
import Link from "next/link";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import Grid from "@material-ui/core/Grid";
import useSwr from "swr";

import { StickyHeader } from "./index";
import {
  getListObjectFromLocalStorage,
  ListPartial,
} from "../utils/localStorage";
import { List } from "../utils/types";
import { PhotoItem } from "../src/PhotoItem";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    headerText: {
      marginLeft: theme.spacing(3),
    },
    search: {
      marginRight: theme.spacing(3),
    },
  })
);

const PhotoList: React.FC<{ id: string }> = ({ id }) => {
  const { data } = useSwr<List>(`/api/list/${id}`);
  console.log(data);
  return (
    <div>
      <TextField
        label="title"
        value={data && data.title ? data.title : "List title not found"}
      />
      <TextField
        label="description"
        multiline
        value={data && data.description ? data.description : ""}
      />
      <Button variant="contained">Update</Button>
      {data && (
        <GridList cellHeight={"auto"}>
          {data.photos.map((photo) => {
            return (
              <GridListTile key={photo.id}>
                <PhotoItem
                  id={photo.id}
                  photoUrls={photo.photoUrls}
                  enabledActions={{ download: true }}
                />
              </GridListTile>
            );
          })}
        </GridList>
      )}
    </div>
  );
};

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
      <Grid item container xs={12} spacing={3}>
        {lists &&
          lists.map((list: ListPartial) => {
            return (
              <Grid key={list.id} item xs={12} sm={6} md={4} lg={3}>
                <PhotoList id={list.id} />
              </Grid>
            );
          })}
      </Grid>
    </Grid>
  );
}
