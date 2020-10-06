import React, { useState } from "react";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import useSWR from "swr";
import unfetch from "unfetch";
import { useDebouncedCallback } from "use-debounce";

import { Photo } from "../utils/types";
import { PhotoSearchResultsGrid } from "../src/PhotoSearchResultsGrid";

const fetcher = (url: string) => unfetch(url).then((r) => r.json());

const DEBOUNCE_INTERVAL = 1500;

const useStyles = makeStyles(() =>
  createStyles({
    stickySearch: {
      position: "fixed",
      top: 0,
      marginTop: "20px",
    },
    photoContainer: {
      marginTop: "90px",
    },
  })
);

export default function Index() {
  const classes = useStyles();
  const [search, setSearch] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchDebounced, setSearchDebounced] = useState("");
  const [searchResults, setSearchResults] = useState<Photo[]>([]);
  const debounced = useDebouncedCallback((value: string) => {
    setSearchDebounced(value);
  }, DEBOUNCE_INTERVAL);
  const { data } = useSWR<{ data: Photo[] }>(
    searchDebounced.length > 0
      ? `/api/search?keyword=${searchDebounced}`
      : null,
    fetcher,
    {
      onSuccess: (data) => {
        setSearchResults(data.data);
        setIsSearching(false);
      },
    }
  );
  console.log(data);
  return (
    <>
      <Grid className={classes.stickySearch} container justify="center">
        <Grid item xs={8}>
          <TextField
            label={"Search photos"}
            fullWidth
            value={search}
            placeholder={"Type to get started!"}
            onChange={(e) => {
              setSearch(e.target.value);
              setIsSearching(true);
              debounced.callback(e.target.value);
            }}
          />
        </Grid>
      </Grid>
      <Container className={classes.photoContainer}>
        <PhotoSearchResultsGrid
          showSkeleton={isSearching}
          photoData={searchResults}
        />
      </Container>
    </>
  );
}
