import React from "react";
import { Box, Typography, Button } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

const QuerySuggestion = ({
  responseLoading,
  result,
  handleCopy,
  copySuccess,
}) => {
  return (
    <div>
      <Box
        sx={{
          padding: 4,
          backgroundColor: "var(--card-background)",
          marginTop: "20px",
          borderRadius: "20px",
        }}
      >
        {result && (
          <Box sx={{ marginBottom: 2 }}>
            <Typography
              variant="body1"
              component="pre"
              sx={{
                whiteSpace: "pre-wrap",
                wordWrap: "break-word",
                color: "var(--primary-text-color)",
              }}
            >
              {result}
            </Typography>
            <Button
              variant="contained"
              startIcon={<ContentCopyIcon />}
              onClick={handleCopy}
              sx={{
                marginTop: 2,
                backgroundColor: "var(--button-background)",
                color: "var(--button-text-color)",
                "&:hover": {
                  backgroundColor: "var(--button-hover-background)",
                },
              }}
            >
              Copy to Clipboard
            </Button>
            {copySuccess && (
              <Typography
                variant="body2"
                sx={{ marginTop: 1, color: "var(--success-color)" }}
              >
                {copySuccess}
              </Typography>
            )}
          </Box>
        )}
      </Box>
    </div>
  );
};

export default QuerySuggestion;
