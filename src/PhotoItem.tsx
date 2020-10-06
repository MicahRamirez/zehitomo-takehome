import React, { useState } from "react";
import GetAppIcon from "@material-ui/icons/GetApp";
import FavoriteIcon from "@material-ui/icons/Favorite";
import { makeStyles, createStyles } from "@material-ui/core/styles";

import { Photo } from "../utils/types";

const usePhotoActionStyles = makeStyles(() =>
  createStyles({
    photoActionsDiv: {
      position: "absolute",
      display: "flex",
      width: "100%",
      justifyContent: "flex-end",
    },
    downloadImage: {
      display: "flex",
    },
    favoriteImage: {
      display: "flex",
    },
  })
);

const PhotoActions: React.FC<{
  id: string;
  downloadURL: string;
  showActions: boolean;
}> = ({ id, downloadURL, showActions }) => {
  const [downloadingImage, setDownloadingImage] = useState(false);
  const classes = usePhotoActionStyles();
  const downloadImage = () => {
    if (!downloadingImage) {
      setDownloadingImage(true);
      fetch("/api/downloadImage", {
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
          document.body.removeChild(link);
          setDownloadingImage(false);
        })
        .catch((error) => {
          console.log("there was an error");
        });
    } else {
      console.log("already downloading");
    }
  };
  const favoriteImage = () => {
    // do async work for downloading an image
  };
  return showActions ? (
    <div className={classes.photoActionsDiv}>
      <div style={{ display: "flex" }}>
        <GetAppIcon onClick={downloadImage} className={classes.downloadImage} />
        <FavoriteIcon
          onClick={favoriteImage}
          className={classes.favoriteImage}
        />
      </div>
    </div>
  ) : null;
};

const useStyles = makeStyles(() =>
  createStyles({
    downloadIcon: {
      position: "absolute",
    },
    imageTag: {
      height: "100%",
      width: "100%",
    },
    imageContainer: {
      height: "100%",
      width: "100%",
      position: "relative",
      zIndex: 4,
    },
  })
);

export const PhotoItem: React.FC<Photo> = ({ id, photoUrls, downloadURL }) => {
  const [isMousedOver, setIsMousedOver] = useState(false);
  const classes = useStyles();
  return (
    <div
      className={classes.imageContainer}
      onMouseEnter={(e) => setIsMousedOver(true)}
      onMouseLeave={(e) => setIsMousedOver(false)}
    >
      <PhotoActions
        showActions={isMousedOver}
        id={id}
        downloadURL={downloadURL}
      />
      <img key={id} src={photoUrls.small} className={classes.imageTag} />
    </div>
  );
};
