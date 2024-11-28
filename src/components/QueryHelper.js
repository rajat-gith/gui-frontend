import React, { useEffect } from "react";
import { Box, TextField, Button, Tooltip } from "@mui/material";

const QueryHelper = ({
  isTableSelected,
  userPrompt,
  setUserPrompt,
  executeQueryHelp,
}) => {
  useEffect(() => {
    console.log(isTableSelected);
  }, [isTableSelected]);
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        padding: "16px",
        backgroundColor: "#f9f9f9",
        borderRadius: "8px",
      }}
    >
      <TextField
        label="Enter your question"
        variant="outlined"
        fullWidth
        sx={{ marginRight: "16px" }}
        value={userPrompt}
        onChange={(e) => setUserPrompt(e.target.value)}
      />
      <Tooltip title="Choose a table from the left side catalogue">
        <div>
          <Button
            sx={{
              padding: "10px 24px",
              backgroundColor: "#1976d2",
              color: "white",
              "&:hover": { backgroundColor: "#1565c0" },
            }}
            disabled={!isTableSelected}
            variant="contained"
            onClick={() => executeQueryHelp(userPrompt)}
          >
            Suggest Query
          </Button>
        </div>
      </Tooltip>
    </Box>
  );
};

export default QueryHelper;
