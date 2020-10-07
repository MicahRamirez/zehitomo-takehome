import React from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Paper from "@material-ui/core/Paper";
import Divider from "@material-ui/core/Divider";
import Container from "@material-ui/core/Container";

import { Photo } from "../utils/types";
import { CreateListForm } from "./CreateListForm";
import { QuickListAddForm } from "./QuickListAddForm";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    modal: {
      marginTop: theme.spacing(2),
      overflowY: "scroll", // on small devices user needs to be able to scroll through whole modal
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

export const ListModal: React.FC<{
  open: boolean;
  onClose: () => void;
  photoUrls: Photo["photoUrls"];
  photoId: Photo["id"];
}> = ({ open, onClose, photoUrls, photoId }) => {
  const classes = useStyles();
  return (
    <Modal open={open} onClose={onClose} className={classes.modal}>
      <Container maxWidth={"sm"} disableGutters>
        <Paper>
          <div className={classes.imageContainer}>
            <img className={classes.image} src={photoUrls.small} />
          </div>

          <Divider />
          <QuickListAddForm
            photoId={photoId}
            photoUrls={photoUrls}
            onClose={onClose}
          />
          <Divider />
          <CreateListForm
            photoUrls={photoUrls}
            photoId={photoId}
            onClose={onClose}
          />
        </Paper>
      </Container>
    </Modal>
  );
};
