import React, { useEffect, useState } from "react";
import { Box, TextField, Button, Alert, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { GoogleGenerativeAI } from "@google/generative-ai";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

import { queryRun } from "../actions/DBActions";
import ConnectDBForm from "../components/ConnectDBForm";
import QueryDataTable from "../components/QueryDataTable";

const MainScreen = () => {
  const dispatch = useDispatch();

  const [isConnected, setIsConnected] = useState(false);
  const [isTextboxFocused, setIsTextboxFocused] = useState(false);
  const [selectedDb, setSelectedDb] = useState(null);

  const [dbs, setDbs] = useState();
  const [tablesMap, setTablesMap] = useState({});
  const [query, setQuery] = useState("");
  const [selectedText, setSelectedText] = useState("");

  const [result, setResult] = useState("");
  const [responseLoading, setResponseLoading] = useState(false);
  const [responseError, setResponseError] = useState(null);
  const [suggestQueryTable, setsuggestQueryTable] = useState("");
  const [suggestQueryDb, setSuggestQueryDb] = useState("");
  const [prompt, setPrompt] = useState("");
  const [copySuccess, setCopySuccess] = useState("");
  const [userPrompt, setUserPrompt] = useState("");

  const { systemQuery, userQuery } = useSelector((state) => state.queryRun);

  const handleReloadDb = () => {
    dispatch(queryRun("SHOW DATABASES"));
  };

  useEffect(() => {
    const dbConnected = localStorage.getItem("isDbConnected") === "true";
    setIsConnected(dbConnected);
  }, []);

  useEffect(() => {
    if (!systemQuery?.data) return;
    const data = systemQuery.data?.data;
    if (data[0] && Object.keys(data[0])[0] === "Database") {
      setDbs(data);
    }

    if (data[0] && Object.keys(data[0])[0].split("_")[0] === "Tables") {
      const dbName = Object.keys(data[0])[0].split("_")[2];
      setTablesMap((prev) => ({
        ...prev,
        [dbName]: data,
      }));
    }
  }, [systemQuery]);

  const handleBoxClick = (db) => {
    setSelectedDb((prevSelectedDb) =>
      prevSelectedDb === db["Database"] ? null : db["Database"]
    );
    dispatch(queryRun(`SHOW TABLES FROM ${db["Database"]}`));
  };

  const handleQueryExecute = () => {
    if (isTextboxFocused && query.trim()) {
      dispatch(queryRun(selectedText));
    }
  };

  const handleCopy = () => {
    if (result) {
      navigator.clipboard
        .writeText(result)
        .then(() => {
          setCopySuccess("Copied to clipboard!");
          setTimeout(() => setCopySuccess(""), 2000); // Reset message after 2 seconds
        })
        .catch(() => {
          setCopySuccess("Failed to copy!");
        });
    }
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    localStorage.setItem("isDbConnected", "false");
    setDbs(null);
    setTablesMap({});
  };

  const handleMouseUp = () => {
    console.log(`Selected text: ${window.getSelection().toString()}`);
    setSelectedText(window.getSelection().toString());
  };

  const fetchResult = async (tableSchema, prompt) => {
    setResponseLoading(true);
    setResponseError(null);
    const finalPrompt = `Give me Query to find '${prompt}' for the table. The table schema is '${JSON.stringify(
      tableSchema
    )}'`;
    try {
      const genAI = new GoogleGenerativeAI(
        process.env.REACT_APP_GEMINI_API_KEY
      );
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      console.log(process.env.REACT_APP_GEMINI_API_KEY);
      const result = await model.generateContent(finalPrompt);
      const regex = /```sql\n(.*?)\n```/s;
      const extractedQuery = result.response.text().match(regex);
      setResult(extractedQuery[1]);
    } catch (err) {
      setResponseError(err.message || "Error generating content");
    } finally {
      setResponseLoading(false);
    }
  };

  const handleTableCLick = (db, table) => {
    console.log(db, table);
    setSuggestQueryDb(db);
    setsuggestQueryTable(table);
  };

  const handleQueryHelp = () => {
    if (suggestQueryDb.length && suggestQueryTable.length) {
      console.log("Both the database and table suggestions are available!");
      dispatch(queryRun(`DESCRIBE ${suggestQueryDb}.${suggestQueryTable} `));
    }
    const tableSchema = systemQuery?.data?.data;
    fetchResult(tableSchema, userPrompt);
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
          <Button
            onClick={() => handleReloadDb()}
            variant="contained"
            sx={{ marginBlockEnd: "10px" }}
          >
            Reload Databases
          </Button>
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
                    display: selectedDb === db["Database"] ? "block" : "none",
                  }}
                  onClick={() =>
                    handleTableCLick(
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
              onMouseUp={handleMouseUp}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsTextboxFocused(true)}
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
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                padding: "16px",
                backgroundColor: "#f9f9f9",
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
              }}
            >
              <TextField
                label="Enter your question"
                variant="outlined"
                fullWidth
                sx={{ marginRight: "16px" }}
                value={userPrompt} // Bind the value to the state
                onChange={(e) => setUserPrompt(e.target.value)}
              />
              <Button
                sx={{
                  padding: "10px 24px",
                  backgroundColor: "#1976d2",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "#1565c0",
                  },
                }}
                onClick={() => handleQueryHelp(userPrompt)}
                variant="contained"
              >
                Suggest Query
              </Button>
            </Box>
            <Box sx={{ padding: 4 }}>
              {result && (
                <Box sx={{ marginBottom: 2 }}>
                  <Typography
                    variant="body1"
                    component="pre"
                    sx={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}
                  >
                    {result}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<ContentCopyIcon />}
                    onClick={handleCopy}
                    sx={{ marginTop: 2 }}
                  >
                    Copy to Clipboard
                  </Button>
                  {copySuccess && (
                    <Typography
                      variant="body2"
                      color="success.main"
                      sx={{ marginTop: 1 }}
                    >
                      {copySuccess}
                    </Typography>
                  )}
                </Box>
              )}
            </Box>
            {suggestQueryTable.length ? (
              <Alert severity="success">
                {suggestQueryTable} table is selected
              </Alert>
            ) : (
              ""
            )}
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
        </Box>
      </Box>
    </Box>
  );
};

export default MainScreen;
