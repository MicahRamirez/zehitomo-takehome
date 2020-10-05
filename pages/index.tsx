import React, { useState } from "react";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import useSWR from "swr";
import fetch from "unfetch";
import { useDebounce, useDebouncedCallback } from "use-debounce";

import Skeleton from "@material-ui/lab/Skeleton";
import Grid from "@material-ui/core/Grid";

import { Photo } from "../utils/types";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const PhotoDisplay: React.FC<{ photoData: Photo[] }> = ({ photoData }) => {
  return <div>{JSON.stringify(photoData)}</div>;
};

const PhotoDisplaySkeleton = () => {
  const skellieChildren = [];
  for (let i = 0; i < 16; i++) {
    skellieChildren.push(<Skeleton key={i} width={200} height={200} />);
  }
  return <PhotoDisplayGrid>{skellieChildren}</PhotoDisplayGrid>;
};

const PhotoDisplayGrid: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const makeColumnsAndRows = (children: React.ReactNode[]) => {
    const formattedChildren = [];
    let currentRow: React.ReactNode[] = [];
    for (let childIndex = 0; childIndex < children.length; childIndex++) {
      if (childIndex % 4 === 0 && childIndex > 0) {
        formattedChildren.push(
          <Grid
            key={`row_${Math.floor(childIndex / 4)}`}
            container
            item
            xs={12}
          >
            {currentRow}
          </Grid>
        );
        currentRow = [];
      }
      currentRow.push(
        <Grid key={`item_${childIndex}`} item xs={3}>
          {children[childIndex]}
        </Grid>
      );
    }
    return formattedChildren;
  };
  return (
    <Grid container>
      {Array.isArray(children) && makeColumnsAndRows(children)}
    </Grid>
  );
};

const DEBOUNCE_INTERVAL = 1500;

export default function Index() {
  const [search, setSearch] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchDebounced, setSearchDebounced] = useState("");
  const debounced = useDebouncedCallback((value: string) => {
    setSearchDebounced(value);
  }, DEBOUNCE_INTERVAL);
  const { data } = useSWR(
    searchDebounced.length > 0
      ? `/api/search?keyword=${searchDebounced}`
      : null,
    fetcher,
    { onSuccess: () => setIsSearching(false) }
  );
  console.log("search", search, "searchDebounced", searchDebounced);
  console.log("isSearching", isSearching);
  return (
    <Container>
      <Box my={4}>
        <TextField
          label={"search"}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setIsSearching(true);
            debounced.callback(e.target.value);
          }}
        />
      </Box>
      {data && !isSearching && <PhotoDisplay photoData={data as Photo[]} />}
      {isSearching && <PhotoDisplaySkeleton />}
    </Container>
  );
}
