import React from "react";
import { Box, Typography } from "@mui/material";
import QueryDataTable from "./QueryDataTable";

const QueryOutput = ({ userQuery }) => {
  console.log(userQuery);
  return (
    <Box>
      <Typography
        variant="h4"
        sx={{ margin: "10px", color: "var(--primary-text-color)" }}
      >
        Query Output:
      </Typography>
      <Box
        sx={{
          padding: "16px",
          border: "1px solid var(--border-color)",
          backgroundColor: "var(--card-background)",
          color: "var(--primary-text-color)",
          whiteSpace: "pre-wrap",
          fontFamily: "monospace",
          borderRadius: "8px",
        }}
      >
        {userQuery?.loading ? (
          "Loading..."
        ) : userQuery?.error ? (
          `Error: ${userQuery.error.data.data}`
        ) : userQuery?.data ? (
          <QueryDataTable data={userQuery.data?.data} />
        ) : (
          "No Output found"
        )}
      </Box>
    </Box>
  );
};

export default QueryOutput;
