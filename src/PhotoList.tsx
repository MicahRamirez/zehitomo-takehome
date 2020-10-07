import React from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import Grid from "@material-ui/core/Grid";
import useSwr from "swr";

import { List } from "../utils/types";
import { PhotoItem } from "../src/PhotoItem";
import { UpdateListForm } from "../src/UpdateListForm";

const usePhotoListStyles = makeStyles(() =>
  createStyles({
    gridBorder: {
      borderBottom: "solid",
    },
  })
);

export const PhotoList: React.FC<{ id: string }> = ({ id }) => {
  const { data } = useSwr<List>(`/api/list/${id}`);
  const classes = usePhotoListStyles();
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
          <Grid
            item
            xs={12}
            md={8}
            lg={8}
            style={{
              maxHeight: "500px",
              overflowX: "hidden",
              overflowY: "scroll",
            }}
          >
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
