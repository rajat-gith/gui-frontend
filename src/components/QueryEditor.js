import React, { useState, useRef, useEffect } from "react";
import { Box, TextField, Button } from "@mui/material";
import { queryRun } from "../actions/DBActions";
import { useSelector } from "react-redux";

const QueryEditor = ({
  isDbConnected,
  userQuery,
  dispatch,
  connId,
  currentDb,
}) => {
  const [query, setQuery] = useState("");
  const textFieldRef = useRef(null);

  useEffect(() => {}, [isDbConnected]);
  const handleQueryExecute = () => {
    const textArea = textFieldRef.current;

    if (textArea) {
      const selectedText = textArea.value.substring(
        textArea.selectionStart,
        textArea.selectionEnd
      );

      let queryToExecute = selectedText.trim() || query.trim();
      if (queryToExecute) {
        queryToExecute = `USE ${currentDb}; ${queryToExecute}`;
        dispatch(queryRun(queryToExecute, connId));
      }
    } else {
      console.error("Text area reference is not available.");
    }
  };

  return (
    <Box>
      <TextField
        fullWidth
        multiline
        rows={6}
        placeholder="Write your query here..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        inputRef={textFieldRef}
        sx={{
          marginBottom: "16px",
          "& .MuiInputBase-root": { color: "var(--primary-text-color)" },
          border: "2px solid var(--border-color)",
          borderRadius: "20px",
        }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleQueryExecute}
        disabled={userQuery?.loading || !(isDbConnected === true)}
        sx={{ marginBottom: "16px" }}
      >
        Execute Query
      </Button>
    </Box>
  );
};

export default QueryEditor;
