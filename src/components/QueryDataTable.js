import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
} from "@mui/material";

const QueryDataTable = ({ data }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Helper function to determine if the data is a MySQL result object or an array of objects
  const processData = (inputData) => {
    // If it's a MySQL result object (with fieldCount, affectedRows, etc.)
    if (
      inputData &&
      typeof inputData === "object" &&
      "fieldCount" in inputData
    ) {
      return [
        {
          ...inputData,
          message: inputData.message || "Database operation completed",
        },
      ];
    }

    // If it's an array of objects (normal data)
    if (Array.isArray(inputData) && inputData.length > 0) {
      return inputData;
    }

    // If no data or empty array
    return [];
  };

  // Process the data
  const processedData = processData(data);

  // If no data to display
  if (processedData.length === 0) {
    return <div>No data to display</div>;
  }

  // Get columns dynamically
  const columns = Object.keys(processedData[0] || {});

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <TableContainer
      component={Paper}
      sx={{ backgroundColor: "var(--card-background)" }}
    >
      <Table sx={{ color: "var(--primary-text-color)" }}>
        <TableHead sx={{ backgroundColor: "var(--sidebar-background)" }}>
          <TableRow>
            {columns.map((col) => (
              <TableCell
                key={col}
                align="center"
                sx={{
                  color: "var(--primary-text-color)",
                  borderBottom: "1px solid var(--border-color)",
                  fontWeight: "bold",
                }}
              >
                {col}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {processedData
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((row, index) => (
              <TableRow
                key={index}
                sx={{
                  "&:nth-of-type(odd)": {
                    backgroundColor: "var(--hover-effect)",
                  },
                }}
              >
                {columns.map((col) => (
                  <TableCell
                    key={col}
                    align="center"
                    sx={{
                      color: "var(--primary-text-color)",
                      borderBottom: "1px solid var(--border-color)",
                    }}
                  >
                    {/* Convert complex objects to JSON string, handle date formatting */}
                    {row[col] instanceof Date
                      ? row[col].toLocaleString()
                      : typeof row[col] === "object"
                      ? JSON.stringify(row[col])
                      : row[col]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={processedData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{
          backgroundColor: "var(--card-background)",
          color: "var(--primary-text-color)",
          borderTop: "1px solid var(--border-color)",
        }}
      />
    </TableContainer>
  );
};

export default QueryDataTable;
