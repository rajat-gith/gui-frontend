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

  if (!data || data.length === 0) {
    return <div>No data to display</div>;
  }

  const columns = Object.keys(data[0]);

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
                }}
              >
                {col}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data
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
                    {row[col]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={data.length}
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
