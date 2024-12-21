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

import { connectDb, disconnectDb, queryRun } from "../actions/DBActions";
import QuerySuggestion from "../components/QuerySuggestion";
import { getDecryptedItem } from "../utils/storageUtils";

const MainScreen = () => {
  const dispatch = useDispatch();
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
  const [shouldFetchResult, setShouldFetchResult] = useState(false);

  const isDbConnected = localStorage.getItem("isDbConnected");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const handleConnect = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleConnectionSuccess = () => {
    setIsConnected(true);
    setIsModalOpen(false);
  };

  const { systemQuery, userQuery } = useSelector((state) => state.queryRun);

  useEffect(() => {
    const dbConnected = localStorage.getItem("isDbConnected") === "true";
    setIsConnected(dbConnected);
  }, []);

  useEffect(() => {}, [isDbConnected]);

  useEffect(() => {
    if (!systemQuery?.data) return;
    const data = systemQuery.data?.data;
    if (data[0] && Object.keys(data[0])[0] === "Database") {
      setDbs(data);
    }

    if (data[0] && Object.keys(data[0])[0].split("_")[0] === "Tables") {
      const dbName = Object.keys(data[0])[0].split("_").slice(2).join("_");
      setTablesMap((prev) => ({
        ...prev,
        [dbName]: data,
      }));
    }
  }, [systemQuery]);

  const handleReloadDb = () => {
    dispatch(queryRun("SHOW DATABASES"));
  };

  const fetchResult = async (tableSchema, prompt, table) => {
    setResponseLoading(true);
    setResponseError(null);
    const finalPrompt = `Give me Query to find '${prompt}' for the table. The table schema is '${JSON.stringify(
      tableSchema
    )} of ${table}`;
    console.log("Here.............");
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
      dispatch(
        queryRun(
          `DESCRIBE ${suggestQueryDb}.${suggestQueryTable}`,
          "system",
          (data) => {
            console.log(data);
            fetchResult(data, userPrompt, suggestQueryTable);
          }
        )
      );
      setShouldFetchResult(true);
    }
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    localStorage.setItem("isDbConnected", "false");
    dispatch(disconnectDb());
    setDbs(null);
    setTablesMap({});
  };

  const handleTableCLick = (db, table) => {
    setSuggestQueryDb(db);
    setsuggestQueryTable(table);
    setTableSelectAlert(true);
  };

  const handleDbClick = (db) => {
    setSelectedDb(db["Database"]);
    dispatch(queryRun(`SHOW TABLES FROM ${db["Database"]}`));
    let connDetails = JSON.parse(getDecryptedItem("conn"));
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
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          padding: "16px",
          borderBottom: "1px solid var(--border-color)",
          bgcolor: "var(--background-color)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {!(isDbConnected === "true") ? (
          <Button variant="contained" onClick={handleConnect}>
            Connect to Database
          </Button>
        ) : (
          <Button
            variant="contained"
            color="secondary"
            onClick={handleDisconnect}
          >
            Disconnect
          </Button>
        )}

        <ConnectDBForm
          open={isModalOpen}
          onClose={handleCloseModal}
          isConnected={isConnected}
          onDisconnect={handleDisconnect}
          onConnectionSuccess={handleConnectionSuccess}
        />
      </Box>

      <Box
        sx={{
          overflowY: "scroll",
          display: "flex",
          flex: 1,
          backgroundColor: "var(--background-color)",
          padding: "16px",
          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "var(--hover-effect)",
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "var(--divider-color)",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "var(--sidebar-background)",
          },
        }}
      >
        {isDbConnected && (
          <DatabaseSidebar
            dbs={dbs}
            tablesMap={tablesMap}
            selectedDb={selectedDb}
            setSelectedDb={setSelectedDb}
            onReload={handleReloadDb}
            onDbClick={handleDbClick}
            onTableClick={handleTableCLick}
            isDbConnected={isDbConnected}
          />
        )}
        <Box
          sx={{
            flex: 1,
            padding: "16px",
            overflowY: "auto",
            bgcolor: "var(--background-color)",
          }}
        >
          <QueryEditor userQuery={userQuery} dispatch={dispatch} />
          <QueryHelper
            isTableSelected={suggestQueryTable.length > 0}
            userPrompt={userPrompt}
            executeQueryHelp={handleQueryHelp}
            setUserPrompt={setUserPrompt}
            responseLoading={responseLoading}
            suggestQueryDb={suggestQueryDb}
            suggestQueryTable={suggestQueryTable}
          />
          <QuerySuggestion result={result} handleCopy={handleCopy} />
          <QueryOutput userQuery={userQuery} />
        </Box>
      </Box>

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
    </Box>
  );
};

export default MainScreen;
