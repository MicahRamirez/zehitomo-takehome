import React from "react";
import Skeleton from "@material-ui/lab/Skeleton";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";

import { PhotoItem } from "./PhotoItem";
import { Photo } from "../utils/types";

const LOADING_SKELETON_COUNT = 12;

// required for forcing skeletons to have height that could mimic the eventual size of a photo.
const useStyles = makeStyles(() =>
  createStyles({
    gridRow: {
      minHeight: "250px",
    },
  })
);

// renders skeletons when there is a pending search along with any photos that exist
export const PhotoSearchResultsGrid: React.FC<{
  photoData: Photo[];
  showSkeleton: boolean;
}> = ({ photoData, showSkeleton }) => {
  // if pagination is properly implemented there can be both pictures from the api and skeletons being rendered by the PhotoDisplayGrid
  const photoDisplayChildren = () => {
    const mergedChildren = [];
    if (photoData) {
      photoData.forEach((photo) => {
        mergedChildren.push(<PhotoItem key={photo.id} {...photo} />);
      });
    }
    if (showSkeleton) {
      for (let i = 0; i < LOADING_SKELETON_COUNT; i++) {
        mergedChildren.push(
          <Skeleton width={"100%"} height={"100%"} key={i} />
        );
      }
    }
    return mergedChildren;
  };
  return <PhotoDisplayGrid>{photoDisplayChildren()}</PhotoDisplayGrid>;
};

// responsible for putting some number of children elements into a grid with 4 elements in each row.
const PhotoDisplayGrid: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const classes = useStyles();
  return (
    <Grid container spacing={2}>
      {Array.isArray(children) &&
        children.map((child, i) => {
          return (
            <Grid
              key={i}
              item
              xs={12}
              sm={6}
              md={4}
              lg={3}
              className={classes.gridRow}
            >
              {child}
            </Grid>
          );
        })}
    </Grid>
  );
};
