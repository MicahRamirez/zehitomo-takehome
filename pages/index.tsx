import React, { useState } from "react";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import axios from "axios";

import useSWR, { mutate } from "swr";
import unfetch from "unfetch";
import { useDebouncedCallback } from "use-debounce";

import Skeleton from "@material-ui/lab/Skeleton";
import Grid from "@material-ui/core/Grid";

import { Photo } from "../utils/types";

const fetcher = (url: string) => unfetch(url).then((r) => r.json());

const PhotoItem: React.FC<Photo> = ({ id, photoUrls, downloadURL }) => {
  const [isMousedOver, setIsMousedOver] = useState(false);
  return (
    <div style={{ width: "100%", height: "100%" }}>
      {isMousedOver && (
        <a
          onClick={async (e) => {
            e.preventDefault();

            await fetch("/api/downloadImage", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ imageURL: downloadURL, photoId: id }),
            })
              .then((response) => {
                return response.blob();
              })
              .then((blob) => {
                console.log(blob);
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", "testimg.jpeg");
                document.body.appendChild(link);
                link.click();
              });
          }}
        >
          Download
        </a>
      )}
      <img
        onMouseOver={(e) => setIsMousedOver(true)}
        key={id}
        style={{ width: "100%", height: "100%" }}
        src={photoUrls.small}
      />
    </div>
  );
};

const PhotoDisplay: React.FC<{ photoData: Photo[] }> = ({ photoData }) => {
  return (
    <PhotoDisplayGrid>
      {photoData.map((photo) => {
        return <PhotoItem key={photo.id} {...photo} />;
      })}
    </PhotoDisplayGrid>
  );
};

const PhotoDisplaySkeleton = () => {
  const skellieChildren = [];
  for (let i = 0; i < 9; i++) {
    skellieChildren.push(<Skeleton style={{ height: "400px" }} key={i} />);
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
            spacing={2}
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
    <Grid container spacing={2}>
      {Array.isArray(children) && makeColumnsAndRows(children)}
    </Grid>
  );
};

const DEBOUNCE_INTERVAL = 1500;

const useStyles = makeStyles((theme: Theme) =>
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
  const debounced = useDebouncedCallback((value: string) => {
    debugger;
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
        {data && !isSearching && (
          <PhotoDisplay photoData={data.data as Photo[]} />
        )}
        {isSearching && <PhotoDisplaySkeleton />}
      </Container>
    </>
  );
}
