import React, { useState } from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Paper from "@material-ui/core/Paper";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";

import { Photo } from "../utils/types";
import { PhotoActions } from "./PhotoActions";
import { PhotoUserInformation } from "./PhotoUserInformation";
import { CreateListForm } from "./CreateListForm";

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

const useModalStyles = makeStyles((theme: Theme) =>
  createStyles({
    modal: {
      marginTop: theme.spacing(2),
    },
    imageContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: theme.spacing(3),
    },
    image: {
      marginBottom: theme.spacing(),
      borderRadius: theme.spacing(),
    },
  })
);

const ListModal: React.FC<{
  open: boolean;
  onClose: () => void;
  photoUrls: Photo["photoUrls"];
  photoId: Photo["id"];
}> = ({ open, onClose, photoUrls, photoId }) => {
  const [listName, setListName] = useState("");
  const [listDescription, setListDescription] = useState("");
  const classes = useModalStyles();
  return (
    <Modal open={open} onClose={onClose} className={classes.modal}>
      <Container maxWidth={"sm"} disableGutters>
        <Paper>
          <div className={classes.imageContainer}>
            <img className={classes.image} src={photoUrls.small} />
            <Typography variant="h5" component="h6">
              Adding to favorites
            </Typography>
          </div>

          <Divider />
          <List>
            <ListItem>
              <ListItemText
                primary="Special Photo List"
                secondary={"this is the best list"}
              />
            </ListItem>
          </List>
          <Divider />
          <CreateListForm photoUrls={photoUrls} photoId={photoId} />
        </Paper>
      </Container>
    </Modal>
  );
};

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
