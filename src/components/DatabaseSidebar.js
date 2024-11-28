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
        backgroundColor: "#f4f4f4",
        borderRight: "1px solid #ccc",
        padding: "16px",
        overflowY: "auto",
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
            border: "1px solid gray",
            marginBottom: "8px",
          }}
        >
          {db["Database"]}
          {tablesMap[db["Database"]]?.map((table) => (
            <Box
              key={table[`Tables_in_${db["Database"]}`]}
              sx={{
                padding: "4px",
                marginLeft: "16px",
                border: "1px solid lightgray",
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
