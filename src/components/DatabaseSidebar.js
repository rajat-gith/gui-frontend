import React, { useEffect } from "react";
import { Box, Button } from "@mui/material";

const DatabaseSidebar = ({
  dbs,
  tablesMap,
  selectedDb,
  setSelectedDb,
  onReload,
  onDbClick,
  onTableClick,
}) => {
  useEffect(() => {}, [tablesMap]);
  return (
    <Box
      sx={{
        width: "25%",
        backgroundColor: "var(--sidebar-background)",
        color: "var(--primary-text-color)",
        borderRight: "1px solid var(--border-color)",
        padding: "16px",
        overflowY: "auto",
        transition: "all 0.3s ease-in-out",
      }}
    >
      <Button
        onClick={onReload}
        variant="contained"
        sx={{ marginBottom: "10px" }}
      >
        Reload Databases
      </Button>
      {dbs?.map((db) => (
        <Box
          key={db["Database"]}
          onClick={() => onDbClick(db)}
          sx={{
            cursor: "pointer",
            padding: "8px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            marginBottom: "8px",
            borderRadius: "30px",
            border:
              selectedDb === db["Database"]
                ? "2px solid green"
                : "1px solid var(--border-color)",
          }}
        >
          <Box>{db["Database"]}</Box>
          {tablesMap[db["Database"]]?.map((table) => (
            <Box
              key={table[`Tables_in_${db["Database"]}`]}
              sx={{
                padding: "4px",
                marginBottom: "0.5rem",
                border: "1px solid var(--border-color)",
                borderRadius: "40px",
                wordWrap: "break-word",
                display: selectedDb === db["Database"] ? "block" : "none",
              }}
              onClick={() =>
                onTableClick(
                  db["Database"],
                  table[`Tables_in_${db["Database"]}`]
                )
              }
            >
              {table[`Tables_in_${db["Database"]}`]}
            </Box>
          ))}
        </Box>
      ))}
    </Box>
  );
};
export default DatabaseSidebar;
