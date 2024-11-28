import { Button, IconButton } from "@mui/material";
import React from "react";
import CloseIcon from "@mui/icons-material/Close";

const SnackBarContent = ({ handleClose }) => {
  return (
    <React.Fragment>
      <Button color="secondary" size="small" onClick={handleClose}>
        UNDO
      </Button>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );
};

export default SnackBarContent;
