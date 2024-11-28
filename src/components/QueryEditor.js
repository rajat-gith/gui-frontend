import React, { useState } from "react";
import { Box, TextField, Button } from "@mui/material";
import { queryRun } from "../actions/DBActions";

const QueryEditor = ({ userQuery, dispatch }) => {
  const [query, setQuery] = useState("");

  const handleQueryExecute = () => {
    console.log(query);
    if (query.trim()) {
      dispatch(queryRun(query));
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
        sx={{ marginBottom: "16px" }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleQueryExecute}
        disabled={userQuery?.loading}
        sx={{ marginBottom: "16px" }}
      >
        Execute Query
      </Button>
    </Box>
  );
};

export default QueryEditor;
