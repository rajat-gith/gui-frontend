import React from "react";

import { Box, Typography, Button } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

const QuerySuggestion = ({ result, handleCopy, copySuccess }) => {
  return (
    <div>
      <Box sx={{ padding: 4 }}>
        {result && (
          <Box sx={{ marginBottom: 2 }}>
            <Typography
              variant="body1"
              component="pre"
              sx={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}
            >
              {result}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<ContentCopyIcon />}
              onClick={handleCopy}
              sx={{ marginTop: 2 }}
            >
              Copy to Clipboard
            </Button>
            {copySuccess && (
              <Typography
                variant="body2"
                color="success.main"
                sx={{ marginTop: 1 }}
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
