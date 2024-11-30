import React, { useEffect } from "react";
import { Box, TextField, Button, Tooltip } from "@mui/material";

const QueryHelper = ({
  isTableSelected,
  userPrompt,
  setUserPrompt,
  executeQueryHelp,
  responseLoading,
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
        backgroundColor: "var(--card-background)",
        borderRadius: "8px",
        color: "var(--primary-text-color)",
      }}
    >
      <TextField
        label="Enter your question"
        variant="outlined"
        fullWidth
        sx={{
          marginRight: "16px",
          "& .MuiOutlinedInput-root": {
            color: "var(--primary-text-color)",
            "& fieldset": {
              borderColor: "var(--border-color)",
            },
            "&:hover fieldset": {
              borderColor: "var(--button-hover-background)",
            },
          },
          "& .MuiInputLabel-root": {
            color: "var(--secondary-text-color)",
          },
        }}
        disabled={responseLoading}
        value={userPrompt}
        onChange={(e) => setUserPrompt(e.target.value)}
      />
      <Tooltip title="Choose a table from the left side catalogue">
        <div>
          <Button
            sx={{
              padding: "10px 24px",
              backgroundColor: "var(--button-background)",
              color: "var(--button-text-color)",
              "&:hover": { backgroundColor: "var(--button-hover-background)" },
            }}
            disabled={!isTableSelected || responseLoading}
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
