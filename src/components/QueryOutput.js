import React from "react";
import { Box } from "@mui/material"
import QueryDataTable from "./QueryDataTable";

const QueryOutput = ({ userQuery }) => (
  <Box>
    <h3>Query Output:</h3>
    <Box
      sx={{
        padding: "8px",
        border: "1px solid gray",
        backgroundColor: "#fafafa",
        whiteSpace: "pre-wrap",
        fontFamily: "monospace",
      }}
    >
      {userQuery?.loading ? (
        "Loading..."
      ) : userQuery?.error ? (
        `Error: ${userQuery.error.message}`
      ) : userQuery?.data ? (
        <QueryDataTable data={userQuery.data?.data} />
      ) : (
        "No Output found"
      )}
    </Box>
  </Box>
);

export default QueryOutput;
