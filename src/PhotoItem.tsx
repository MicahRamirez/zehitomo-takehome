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

export const PhotoItem: React.FC<Photo> = ({
  id,
  photoUrls,
  downloadURL,
  associatedUserImageURL,
  associatedUsername,
  associatedUserProfileURL,
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
        downloadURL={downloadURL}
        setAddToList={setAddToList}
      />
      <img key={id} src={photoUrls.small} className={classes.imageTag} />
      <PhotoUserInformation
        showUserInformation={isMousedOver || addToList}
        userName={associatedUsername}
        profilePicture={associatedUserImageURL}
        profileURL={associatedUserProfileURL}
      />
      <ListModal
        photoUrls={photoUrls}
        open={addToList}
        photoId={id}
        onClose={() => setAddToList(false)}
      />
    </div>
  );
};
