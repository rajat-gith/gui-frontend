import React, { useEffect, useState } from "react";
import { Box, Button, Snackbar, IconButton } from "@mui/material";
import { connect, useDispatch, useSelector } from "react-redux";
import { GoogleGenerativeAI } from "@google/generative-ai";
import CloseIcon from "@mui/icons-material/Close";

import ConnectDBForm from "../components/ConnectDBForm";
import QueryEditor from "../components/QueryEditor";
import DatabaseSidebar from "../components/DatabaseSidebar";
import QueryOutput from "../components/QueryOutput";
import QueryHelper from "../components/QueryHelper";

import { connectDb, queryRun } from "../actions/DBActions";
import QuerySuggestion from "../components/QuerySuggestion";
import { getDecryptedItem } from "../utils/storageUtils";

const MainScreen = () => {
  const dispatch = useDispatch();

  const [isConnected, setIsConnected] = useState(false);
  const [dbs, setDbs] = useState();
  const [tablesMap, setTablesMap] = useState({});
  const [selectedDb, setSelectedDb] = useState(null);
  const [userPrompt, setUserPrompt] = useState("");
  const [suggestQueryTable, setsuggestQueryTable] = useState("");
  const [suggestQueryDb, setSuggestQueryDb] = useState("");
  const [tableSelectAlert, setTableSelectAlert] = useState(false);
  const [responseLoading, setResponseLoading] = useState(false);
  const [result, setResult] = useState("");
  const [responseError, setResponseError] = useState(null);
  const [copySuccess, setCopySuccess] = useState("");

  const isDbConnected = localStorage.getItem("isDbConnected");

  const { systemQuery, userQuery } = useSelector((state) => state.queryRun);

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

  const handleReloadDb = () => {
    dispatch(queryRun("SHOW DATABASES"));
  };

  const fetchResult = async (tableSchema, prompt) => {
    setResponseLoading(true);
    setResponseError(null);
    const finalPrompt = `Give me Query to find '${prompt}' for the table. The table schema is '${JSON.stringify(
      tableSchema
    )}`;
    try {
      const genAI = new GoogleGenerativeAI(
        process.env.REACT_APP_GEMINI_API_KEY
      );
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(finalPrompt);

      const regex = /```sql\n([\s\S]*?)\n```/;
      const extractedQuery = result.response.text().match(regex);

      if (extractedQuery) {
        const sanitizedQuery = extractedQuery[1]
          .replace(/\/\*[\s\S]*?\*\//g, "")
          .replace(/\n/g, " ")
          .replace(/\s+/g, " ")
          .trim();

        setResult(sanitizedQuery);
      } else {
        setResult("No valid SQL query found in the response.");
      }
    } catch (err) {
      setResponseError(err.message || "Error generating content");
    } finally {
      setResponseLoading(false);
    }
  };

  const handleQueryHelp = () => {
    if (suggestQueryDb.length && suggestQueryTable.length) {
      console.log("Both the database and table suggestions are available!");
      dispatch(queryRun(`DESCRIBE ${suggestQueryDb}.${suggestQueryTable}`));
    }
    const tableSchema = systemQuery?.data?.data;
    fetchResult(tableSchema, userPrompt);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    localStorage.setItem("isDbConnected", "false");
    setDbs(null);
    setTablesMap({});
  };

  const handleTableCLick = (db, table) => {
    setSuggestQueryDb(db);
    setsuggestQueryTable(table);
    setTableSelectAlert(true);
  };

  const handleDbClick = (db) => {
    setSelectedDb((prevSelectedDb) =>
      prevSelectedDb === db["Database"] ? null : db["Database"]
    );
    dispatch(queryRun(`SHOW TABLES FROM ${db["Database"]}`));
    let connDetails = JSON.parse(getDecryptedItem("conn"));
    console.log(connDetails);
    connDetails["database"] = db["Database"];
    if (Object.keys(connDetails).length > 0) {
      dispatch(connectDb(connDetails));
    }
  };

  const handleSnackBarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setTableSelectAlert(false);
  };
  const handleCopy = () => {
    if (result) {
      navigator.clipboard
        .writeText(result)
        .then(() => {
          setCopySuccess("Copied to clipboard!");
          setTimeout(() => setCopySuccess(""), 2000);
        })
        .catch(() => {
          setCopySuccess("Failed to copy!");
        });
    }
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
        {isDbConnected ? (
          <DatabaseSidebar
            dbs={dbs}
            tablesMap={tablesMap}
            selectedDb={selectedDb}
            setSelectedDb={setSelectedDb}
            onReload={handleReloadDb}
            onDbClick={(db) => handleDbClick(db)}
            onTableClick={(db, table) => handleTableCLick(db, table)}
          />
        ) : (
          ""
        )}
        <Snackbar
          open={tableSelectAlert}
          autoHideDuration={6000}
          onClose={handleSnackBarClose}
          message={`${suggestQueryTable} table is selected`}
          action={
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleSnackBarClose}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        />
        <Box sx={{ flex: 1, padding: "16px", overflowY: "auto" }}>
          <QueryEditor userQuery={userQuery} dispatch={dispatch} />
          <QueryHelper
            isTableSelected={suggestQueryTable.length > 0}
            userPrompt={userPrompt}
            executeQueryHelp={handleQueryHelp}
            setUserPrompt={setUserPrompt}
          />
          <QuerySuggestion result={result} handleCopy={handleCopy} />
          <QueryOutput userQuery={userQuery} />
        </Box>
      </Box>
    </Box>
  );
};

export default MainScreen;
