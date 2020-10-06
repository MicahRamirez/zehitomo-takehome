import React from "react";
import Skeleton from "@material-ui/lab/Skeleton";
import Grid from "@material-ui/core/Grid";

import { PhotoItem } from "./PhotoItem";
import { Photo } from "../utils/types";

const LOADING_SKELETON_COUNT = 12;

export const PhotoDisplay: React.FC<{
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
            style={{ minHeight: "250px" }}
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
    // when the number of children is not divisible by 4 we'll have to add the remaining row
    if (currentRow.length > 0) {
      formattedChildren.push(
        <Grid
          key={"row_last"}
          container
          item
          xs={12}
          spacing={2}
          style={{ minHeight: "250px" }}
        >
          {currentRow}
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
