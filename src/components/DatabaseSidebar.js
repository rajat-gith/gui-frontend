import React, { useEffect } from "react";
import { Box, Button, Typography } from "@mui/material";
import { useSelector } from "react-redux";

const DatabaseSidebar = ({
  dbs,
  tablesMap,
  selectedDb,
  onReload,
  onDbClick,
  onTableClick,
  isDbConnected,
}) => {
  const { loading, dbConn } = useSelector((state) => state.connectDb);
  useEffect(() => {
  }, [isDbConnected]);
  return (
    <Box
      sx={{
        flex: { xs: "0 0 100%", md: "0 0 250px" },
        backgroundColor: "var(--sidebar-background)",
        color: "var(--primary-text-color)",
        height: "100%",
        p: 2,
        display: isDbConnected === "true" ? "box" : "none",
        overflowY: "auto",
      }}
    >
      <Button
        onClick={onReload}
        variant="contained"
        fullWidth
        disabled={!(isDbConnected === "true")}
        sx={{ mb: 2 }}
      >
        Reload Databases
      </Button>

      {selectedDb && (
        <Box
          sx={{
            mt: 1,
            mb: 2,
            textAlign: "center",
          }}
        >
          <Typography variant="body2">Selected Database:</Typography>
          <Typography variant="subtitle1">
            {!loading
              ? dbConn?.data?.success
                ? selectedDb
                : "Error"
              : "Loading..."}
          </Typography>
        </Box>
      )}

      {dbs?.map((db) => (
        <React.Fragment key={db["Database"]}>
          <Box
            onClick={() => onDbClick(db)}
            sx={{
              p: 1.5,
              mb: 1,
              borderRadius: 3,
              border:
                selectedDb === db["Database"]
                  ? "2px solid green"
                  : "1px solid var(--border-color)",
              cursor: "pointer",
              "&:hover": { bgcolor: "var(--hover-effect)" },
            }}
          >
            <Typography noWrap>{db["Database"]}</Typography>
          </Box>

          {selectedDb === db["Database"] && (
            <Box sx={{ pl: 2, mb: 2 }}>
              {tablesMap[db["Database"]]?.map((table) => (
                <Box
                  key={table[`Tables_in_${db["Database"]}`]}
                  onClick={() =>
                    onTableClick(
                      db["Database"],
                      table[`Tables_in_${db["Database"]}`]
                    )
                  }
                  sx={{
                    p: 1,
                    mb: 0.5,
                    borderRadius: 2,
                    color: "green",
                    cursor: "pointer",
                    "&:hover": { bgcolor: "var(--hover-effect)" },
                  }}
                >
                  <Typography noWrap variant="body2">
                    {table[`Tables_in_${db["Database"]}`]}
                  </Typography>
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
