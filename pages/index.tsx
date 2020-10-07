import React, { useState } from "react";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Link from "next/link";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import Grid from "@material-ui/core/Grid";
import useSWR from "swr";
import { useDebouncedCallback } from "use-debounce";

import { Photo } from "../utils/types";
import { PhotoSearchResultsGrid } from "../src/PhotoSearchResultsGrid";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const DEBOUNCE_INTERVAL = 1500;

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

export default function Index() {
  const [search, setSearch] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchDebounced, setSearchDebounced] = useState("");
  const [searchResults, setSearchResults] = useState<Photo[]>([]);
  const debounced = useDebouncedCallback((value: string) => {
    setSearchDebounced(value);
  }, DEBOUNCE_INTERVAL);
  useSWR<{ data: Photo[] }>(
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
  return (
    <>
      <StickyHeader justify={"space-evenly"}>
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
        <Grid item>
          <Link href="/lists">
            <Button
              variant="outlined"
              color="primary"
              endIcon={<FavoriteBorderIcon />}
            >
              {" "}
              Lists{" "}
            </Button>
          </Link>
        </Grid>
      </StickyHeader>

      <Container>
        <PhotoSearchResultsGrid
          showSkeleton={isSearching}
          photoData={searchResults}
        />
      </Container>
    </>
  );
}
