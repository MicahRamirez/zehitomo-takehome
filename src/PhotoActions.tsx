import React, { useState } from "react";
import GetAppIcon from "@material-ui/icons/GetApp";
import FavoriteIcon from "@material-ui/icons/Favorite";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
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
    rectStrokeColor: {
      stroke: theme.palette.primary.main,
      fill: "none",
    },
  })
);

// shows actions and has functionality to download the associated image or begin the workflow for saving
// a photo to a list
export const PhotoActions: React.FC<{
  id: string;
  downloadURL: string;
  showActions: boolean;
  setAddToList: (isAddingToList: boolean) => void;
  enabledActions?: { download?: boolean; favorite?: boolean };
}> = ({
  id,
  downloadURL,
  showActions,
  setAddToList,
  enabledActions = { download: true, favorite: true },
}) => {
  const [downloadingImage, setDownloadingImage] = useState(false);
  const [downloadOnHover, setDownloadOnHover] = useState(false);
  const [favoriteOnHover, setFavoriteOnHover] = useState(false);
  const classes = useStyles();
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
          console.error("there was an error", error);
        });
    }
  };
  return showActions ? (
    <>
      <div className={classes.photoActionsDiv}>
        <div style={{ display: "flex" }}>
          {enabledActions.download && (
            <rect className={classes.rectStrokeColor}>
              <GetAppIcon
                onClick={downloadImage}
                className={classes.downloadImage}
                titleAccess={"download image"}
                color={downloadOnHover ? "primary" : "secondary"}
                onMouseEnter={() => setDownloadOnHover(true)}
                onMouseLeave={() => setDownloadOnHover(false)}
              />
            </rect>
          )}
          {enabledActions.favorite && (
            <rect className={classes.rectStrokeColor}>
              <FavoriteIcon
                onClick={() => setAddToList(true)}
                className={classes.favoriteImage}
                color={favoriteOnHover ? "primary" : "secondary"}
                onMouseEnter={() => setFavoriteOnHover(true)}
                onMouseLeave={() => setFavoriteOnHover(false)}
              />
            </rect>
          )}
        </div>
      </div>
    </>
  ) : null;
};
