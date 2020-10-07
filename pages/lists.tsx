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
    <Grid xs={12} item container key={id}>
      <Grid item xs={4}>
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
      </Grid>
      <Grid item xs={8}>
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
      </Grid>
    </Grid>
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
      <Grid container spacing={3}>
        {lists &&
          lists.map((list: ListPartial) => {
            return <PhotoList id={list.id} />;
          })}
      </Grid>
    </Grid>
  );
}
