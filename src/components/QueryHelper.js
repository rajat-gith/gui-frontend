import React, { useEffect } from "react";
import { Box, TextField, Button, Tooltip, Alert } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import { useSelector } from "react-redux";

const QueryHelper = ({
  isTableSelected,
  userPrompt,
  setUserPrompt,
  executeQueryHelp,
  responseLoading,
  suggestQueryDb,
  suggestQueryTable,
}) => {
  useEffect(() => {}, [
    isTableSelected,
    suggestQueryDb,
    suggestQueryTable,
  ]);
  const { error, loading, payload } = useSelector(
    (state) => state.generateQuery
  );
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        padding: "16px",
        backgroundColor: "var(--card-background)",
        borderRadius: "8px",
        color: "var(--primary-text-color)",
        border: "1px solid var(--border-color)",
      }}
    >
      {suggestQueryTable && suggestQueryDb && (
        <Alert
          icon={<CheckIcon fontSize="inherit" />}
          severity="success"
          sx={{
            alignItems: "center",
            backgroundColor: "var(--success-color)",
            color: "var(--primary-text-color)",
            "& .MuiAlert-icon": {
              color: "var(--primary-text-color)",
            },
          }}
        >
          The table <strong>{suggestQueryTable}</strong> from database{" "}
          <strong>{suggestQueryDb}</strong> is selected to improve query
          suggestions. To get the most accurate results, please select the
          appropriate table.
        </Alert>
      )}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
        }}
      >
        <TextField
          label="Enter your question"
          variant="outlined"
          fullWidth
          sx={{
            "& .MuiOutlinedInput-root": {
              color: "var(--primary-text-color)",
              backgroundColor: "var(--sidebar-background)",
              "& fieldset": {
                borderColor: "var(--border-color)",
              },
              "&:hover fieldset": {
                borderColor: "var(--button-hover-background)",
              },
              "&.Mui-focused fieldset": {
                borderColor: "var(--link-text-color)",
              },
            },
            "& .MuiInputLabel-root": {
              color: "var(--secondary-text-color)",
              "&.Mui-focused": {
                color: "var(--link-text-color)",
              },
            },
          }}
          disabled={loading}
          value={userPrompt}
          onChange={(e) => setUserPrompt(e.target.value)}
        />
        <Tooltip title="Choose a table from the left side catalogue">
          <div>
            <Button
              sx={{
                padding: "10px 24px",
                backgroundColor:
                  isTableSelected && !loading
                    ? "var(--button-background)"
                    : "var(--suggest-button-background)",
                color: "var(--button-text-color)",
                "&:hover": {
                  backgroundColor:
                    isTableSelected && !loading
                      ? "var(--button-hover-background)"
                      : "var(--hover-effect)",
                },
                transition: "background-color 0.3s ease",
              }}
              disabled={!isTableSelected || loading}
              variant="contained"
              onClick={() => executeQueryHelp(userPrompt)}
            >
              Suggest Query
            </Button>
          </div>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default QueryHelper;
