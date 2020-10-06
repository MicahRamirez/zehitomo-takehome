import React from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import Link from "@material-ui/core/Link";

import { Photo } from "../utils/types";
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    photoUserInformationDiv: {
      position: "absolute",
      display: "flex",
      width: "100%",
      justifyContent: "flex-start",
      bottom: 0,
      backgroundColor: theme.palette.secondary.main,
    },
    avatarCard: {
      display: "flex",
      alignItems: "center",
      margin: theme.spacing(),
    },
    avatar: {
      display: "inline-block",
      marginRight: theme.spacing(),
      marginLeft: theme.spacing(),
    },
    link: {
      display: "inline-block",
      marginLeft: theme.spacing(),
    },
  })
);

// displays a the user photo, user profile, and link
export const PhotoUserInformation: React.FC<{
  showUserInformation: boolean;
  userName: Photo["associatedUsername"];
  profilePicture: Photo["associatedUserImageURL"];
  profileURL: Photo["associatedUserProfileURL"];
}> = ({ showUserInformation, profilePicture, profileURL, userName }) => {
  const classes = useStyles();
  return showUserInformation ? (
    <div className={classes.photoUserInformationDiv}>
      <div className={classes.avatarCard}>
        <Avatar className={classes.avatar} src={profilePicture} />
        <div className={classes.link}>
          <Link
            target="_blank"
            rel="noreferrer"
            href={profileURL}
            aria-label={`Visit ${userName}'s unsplash profile.`}
          >
            {userName}
          </Link>
        </div>
      </div>
    </div>
  ) : null;
};
