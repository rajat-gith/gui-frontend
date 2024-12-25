import React, { useEffect, useState } from "react";
import { Box, Button, Snackbar, IconButton } from "@mui/material";
import { connect, useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";

import ConnectDBForm from "../components/ConnectDBForm";
import QueryEditor from "../components/QueryEditor";
import DatabaseSidebar from "../components/DatabaseSidebar";
import QueryOutput from "../components/QueryOutput";
import QueryHelper from "../components/QueryHelper";

import { connectDb, disconnectDb, queryRun } from "../actions/DBActions";
import QuerySuggestion from "../components/QuerySuggestion";
import { getDecryptedItem } from "../utils/storageUtils";
import { handleQueryHelp } from "../utils/queryHelp";

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

  const navigate = useNavigate();

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

  const handleDisconnect = () => {
    setIsConnected(false);
    localStorage.setItem("isDbConnected", "false");
    dispatch(disconnectDb());
    setDbs(null);
    setTablesMap({});
    setSelectedDb(null);
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

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      setIsSidebarOpen(!mobile);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <Box
        sx={{
          padding: "16px",
          borderBottom: "1px solid var(--border-color)",
          bgcolor: "var(--background-color)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
        }}
      >
        {isMobile && isDbConnected === "true" && (
          <IconButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <MenuIcon style={{ color: "white" }} />
          </IconButton>
        )}
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
        <Button
          onClick={handleLogout}
          sx={{
            bgcolor: "var(--logout-bg, #757575)",
            color: "var(--logout-text-color, white)",
            ":hover": {
              bgcolor: "var(--logout-hover-bg, #494949)",
            },
          }}
        >
          Logout
        </Button>
      </Box>

      <Box
        sx={{
          display: "flex",
          flex: 1,
          position: "relative",
          backgroundColor: "var(--background-color)",
          overflow: "hidden",
        }}
      >
        {isDbConnected && (
          <Box
            sx={{
              width: { xs: "100%", md: "250px" },
              position: { xs: "absolute", md: "relative" },
              height: "100%",
              transform: {
                xs: isSidebarOpen ? "translateX(0)" : "translateX(-100%)",
                md: "none",
              },
              transition: "transform 0.3s ease",
              zIndex: { xs: 10, md: 1 },
              bgcolor: "var(--background-color)",
              borderRight: "1px solid var(--border-color)",
              overflowY: "auto",
            }}
          >
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
          </Box>
        )}

        <Box
          sx={{
            flex: 1,
            padding: { xs: 1, sm: 2, md: 3 },
            overflowY: "auto",
            bgcolor: "var(--background-color)",
            "&::-webkit-scrollbar": { width: "8px" },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "var(--hover-effect)",
              borderRadius: "4px",
              "&:hover": { backgroundColor: "var(--divider-color)" },
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "var(--sidebar-background)",
            },
          }}
        >
          <QueryEditor
            isDbConnected={isDbConnected}
            userQuery={userQuery}
            dispatch={dispatch}
          />
          <QueryHelper
            isTableSelected={suggestQueryTable.length > 0}
            userPrompt={userPrompt}
            executeQueryHelp={() =>
               handleQueryHelp(
                suggestQueryDb,
                suggestQueryTable,
                dispatch,
                queryRun,
                userPrompt,
                setResponseLoading,
                setResponseError,
                setResult,
                setShouldFetchResult
              )
            }
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
