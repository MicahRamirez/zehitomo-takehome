import React from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import Grid from "@material-ui/core/Grid";
import useSwr from "swr";

import { List } from "../utils/types";
import { PhotoItem } from "../src/PhotoItem";
import { UpdateListForm } from "../src/UpdateListForm";

const useStyles = makeStyles(() =>
  createStyles({
    gridBorder: {
      borderBottom: "solid",
    },
    photoGrid: {
      maxHeight: "500px",
      overflowX: "hidden",
      overflowY: "scroll",
    },
  })
);

export const PhotoList: React.FC<{ id: string }> = ({ id }) => {
  const { data } = useSwr<List>(`/api/list/${id}`);
  const classes = useStyles();
  return (
    <>
      {data && (
        <Grid className={classes.gridBorder} xs={12} item container key={id}>
          <UpdateListForm
            id={id}
            title={data && data.title ? data.title : ""}
            description={data && data.description ? data.description : ""}
            photos={data && data.photos ? data.photos : []}
          />
          <Grid item xs={12} md={8} lg={8} className={classes.photoGrid}>
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
      )}{" "}
    </>
  );
};
