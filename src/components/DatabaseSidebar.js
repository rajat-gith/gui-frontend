import React, { useEffect } from "react";
import { Box, Button, Typography } from "@mui/material";
import { useSelector } from "react-redux";

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
  const { loading, dbConn } = useSelector((state) => state.connectDb);

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

      {selectedDb && (
        <Box
          sx={{
            marginTop: "16px",
            color: "var(--primary-text-color)",
            "& .MuiAlert-icon": {
              color: "var(--primary-text-color)",
            },
            textAlign: "center",
          }}
        >
          <Typography variant="body1">Selected Database:</Typography>
          <Typography variant="h6">
            {!loading
              ? dbConn?.data?.success
                ? selectedDb
                : dbConn?.data
                ? "Error connecting Db"
                : "No data available"
              : "Loading..."}
          </Typography>
        </Box>
      )}

      {dbs?.map((db) => (
        <React.Fragment key={db["Database"]}>
          <Box
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
              transition: "all 0.2s ease-in-out",
            }}
          >
            <Box sx={{ alignItems: "center" }}>{db["Database"]}</Box>
          </Box>

          {selectedDb === db["Database"] && (
            <Box sx={{ paddingLeft: "16px" }}>
              {tablesMap[db["Database"]]?.map((table) => (
                <Box
                  key={table[`Tables_in_${db["Database"]}`]}
                  sx={{
                    marginBottom: "0.5rem",
                    borderRadius: "40px",
                    wordWrap: "break-word",
                    color: "green",
                    cursor: "pointer",
                    transition: "opacity 0.2s ease-in-out",
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
          )}
        </React.Fragment>
      ))}
    </Box>
  );
};

export default DatabaseSidebar;
