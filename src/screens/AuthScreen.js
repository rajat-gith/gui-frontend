import React, { useState } from "react";
import { Box, Tabs, Tab, Typography, Paper } from "@mui/material";
import LoginComponent from "../components/LoginComponent";
import RegisterComponent from "../components/RegisterComponent";

const AuthScreen = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box
      sx={{
        display: "flex",
        bgcolor: "var(--background-color)",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        transition: "all 0.3s ease-in-out",
        padding: { xs: 2, md: 4 },
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: { xs: 300, md: 400 },
          padding: { xs: 2, md: 3 },
          backgroundColor: "var(--card-background)",
          color: "var(--primary-text-color)",
          borderRadius: "8px",
          transition: "all 0.3s ease-in-out",
        }}
      >
        <Typography
          variant="h5"
          align="center"
          gutterBottom
          sx={{
            color: "var(--primary-text-color)",
            marginBottom: { xs: 1, md: 2 },
            transition: "all 0.3s ease-in-out",
          }}
        >
          Welcome
        </Typography>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          centered
          variant="fullWidth"
          sx={{
            marginBottom: 2,
            "& .MuiTab-root": {
              color: "var(--secondary-text-color)",
              fontSize: { xs: "0.8rem", md: "1rem" },
            },
            "& .MuiTab-root.Mui-selected": {
              color: "var(--primary-text-color)",
            },
            "& .MuiTabs-indicator": {
              backgroundColor: "var(--button-background)",
            },
          }}
        >
          <Tab label="Login" />
          <Tab label="Register" />
        </Tabs>
        {tabValue === 0 && <LoginComponent />}
        {tabValue === 1 && <RegisterComponent />}
      </Paper>
    </Box>
  );
};

export default AuthScreen;
