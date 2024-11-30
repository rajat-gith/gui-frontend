import { Box, Button, Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

function HomeScreen() {
  return (
    <Box
      sx={{
        bgcolor: "var(--background-color)",
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          left: "10px",
          top: "10px",
          border: "2px solid #303F9F",
          padding: "10px",
          cursor: "pointer",
          borderRadius: "10%",
        }}
      >
        <Typography sx={{ color: "white" }}>Version 1</Typography>
      </Box>
      <Typography variant="h2" sx={{ color: "var(--primary-text-color)" }}>
        Dashboard for Database + AI
      </Typography>
      <img src="/homgpage-1.png" style={{ width: "40%" }} alt="" srcset="" />
      <Link to="/auth">
        <Button
          variant="contained"
          sx={{
            margin: "20px",
            bgcolor: "var(--button-background)",
            color: "var(--button-text-color)",
            ":hover": {
              bgcolor: "var(--button-hover-background)",
              transform: "scale(1.05)",
              transition: "all 0.3s ease-in-out",
            },
          }}
        >
          Explore
        </Button>
      </Link>
    </Box>
  );
}

export default HomeScreen;
