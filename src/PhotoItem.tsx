import React, { useState } from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";

import { Photo } from "../utils/types";
import { PhotoActions } from "./PhotoActions";
import { PhotoUserInformation } from "./PhotoUserInformation";
import { ListModal } from "./ListModal";

const useStyles = makeStyles(() =>
  createStyles({
    imageTag: {
      height: "100%",
      width: "100%",
    },
    imageContainer: {
      height: "100%",
      width: "100%",
      position: "relative",
    },
  })
);

// Only need the associatedUser information on the search page, excluding it on lists for simplicity sake
// https://github.com/Microsoft/TypeScript/issues/25760
type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export const PhotoItem: React.FC<
  WithOptional<
    Photo,
    | "associatedUserImageURL"
    | "associatedUsername"
    | "associatedUserProfileURL"
    | "downloadURL"
  > & { enabledActions?: { download?: boolean; favorite?: boolean } }
> = ({
  id,
  photoUrls,
  associatedUserImageURL,
  associatedUsername,
  associatedUserProfileURL,
  enabledActions,
}) => {
  const [isMousedOver, setIsMousedOver] = useState(false);
  const [addToList, setAddToList] = useState(false);
  const classes = useStyles();
  return (
    <div
      className={classes.imageContainer}
      onMouseEnter={() => setIsMousedOver(true)}
      onMouseLeave={() => setIsMousedOver(false)}
    >
      <PhotoActions
        showActions={isMousedOver || addToList}
        id={id}
        downloadURL={photoUrls.regular}
        setAddToList={setAddToList}
        enabledActions={enabledActions}
      />
      <img
        key={id}
        src={`${photoUrls.regular}&w=400&h=400`}
        className={classes.imageTag}
      />
      {associatedUsername !== undefined &&
        associatedUserImageURL !== undefined &&
        associatedUserProfileURL !== undefined && (
          <PhotoUserInformation
            showUserInformation={isMousedOver || addToList}
            userName={associatedUsername}
            profilePicture={associatedUserImageURL}
            profileURL={associatedUserProfileURL}
          />
        )}
      <ListModal
        photoUrls={photoUrls}
        open={addToList}
        photoId={id}
        onClose={() => setAddToList(false)}
      />
    </div>
  );
};
