import React, { useEffect, useState } from "react";
import { Box, TextField, Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { queryRun, disconnectDatabase } from "../actions/DBActions";
import ConnectDBForm from "../components/ConnectDBForm";

const MainScreen = () => {
  const dispatch = useDispatch();

  const [isConnected, setIsConnected] = useState(false);
  const [isTextboxFocused, setIsTextboxFocused] = useState(false);

  const [dbs, setDbs] = useState();
  const [tablesMap, setTablesMap] = useState({});
  const [query, setQuery] = useState("");
  const [queryOutput, setQueryOutput] = useState("");

  const queryRes = useSelector((state) => state.queryRun);
  const { queryResult } = queryRes;

  useEffect(() => {
    const dbConnected = localStorage.getItem("isDbConnected") === "true";
    setIsConnected(dbConnected);
  }, []);

  useEffect(() => {
    if (queryResult && Object.keys(queryResult["data"][0])[0] === "Database") {
      const { data } = queryResult;
      setDbs(data);
    }
    if (
      queryResult &&
      Object.keys(queryResult["data"][0])[0].split("_")[0] === "Tables"
    ) {
      const { data } = queryResult;

      const dbName = Object.keys(queryResult["data"][0])[0].split("_")[2];
      setTablesMap((prev) => ({
        ...prev,
        [dbName]: data,
      }));
    }
  }, [queryResult]);

  const handleBoxClick = (db) => {
    dispatch(queryRun(`SHOW TABLES FROM ${db["Database"]}`));
  };

  const handleQueryExecute = () => {
    if (isTextboxFocused) {
      dispatch(queryRun(query));
    }
  };

  // Watch for changes in queryResult and update queryOutput
  useEffect(() => {
    if (queryResult) {
      console.log(queryResult.data);

      setQueryOutput(queryResult.data);
    }
  }, [queryResult]);

  const handleDisconnect = () => {
    // dispatch(disconnectDatabase());
    setIsConnected(false);
    localStorage.setItem("isDbConnected", "false");
    setDbs(null);
    setTablesMap({});
  };

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <Box
        sx={{
          padding: "16px",
          borderBottom: "1px solid #ccc",
          backgroundColor: "#f4f4f4",
        }}
      >
        {!isConnected ? (
          <ConnectDBForm />
        ) : (
          <Button
            variant="contained"
            color="secondary"
            onClick={handleDisconnect}
          >
            Disconnect
          </Button>
        )}
      </Box>

      <Box sx={{ display: "flex", flex: 1 }}>
        <Box
          sx={{
            width: "25%",
            backgroundColor: "#f4f4f4",
            borderRight: "1px solid #ccc",
            padding: "16px",
            overflowY: "auto",
          }}
        >
          {dbs?.map((db) => (
            <Box
              key={db["Database"]}
              onClick={() => handleBoxClick(db)}
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
                  }}
                >
                  {table[`Tables_in_${db["Database"]}`]}
                </Box>
              ))}
            </Box>
          ))}
        </Box>

        <Box
          sx={{
            flex: 1,
            padding: "16px",
            overflowY: "auto",
          }}
        >
          <Box>
            <TextField
              fullWidth
              multiline
              rows={6}
              placeholder="Write your query here..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsTextboxFocused(true)}
              sx={{ marginBottom: "16px" }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleQueryExecute}
              sx={{ marginBottom: "16px" }}
            >
              Execute Query
            </Button>
          </Box>

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
              {queryOutput && queryOutput.length > 0
                ? !(
                    Object.keys(queryOutput[0])[0].includes("Tables") ||
                    Object.keys(queryOutput[0])[0] === "Database"
                  )
                  ? JSON.stringify(queryOutput)
                  : "No Output found"
                : "No Output found"}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default MainScreen;
