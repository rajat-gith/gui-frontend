import { Box, Button, Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

function HomeScreen() {
  return (
    <Box
      component="main"
      sx={{
        bgcolor: "var(--background-color)",
        minHeight: "100vh",
        height: "100%",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        position: "relative",
        backgroundImage: "url('/bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        textAlign: "center",
        p: { xs: 2, md: 4 },
        margin: 0,
        boxSizing: "border-box",
        '& *': {
          boxSizing: 'border-box'
        }
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bgcolor: "rgba(0, 0, 0, 0.5)",
          zIndex: 1,
        }}
      />

      <Box
        sx={{
          position: "absolute",
          left: { xs: "5px", md: "10px" },
          top: { xs: "5px", md: "10px" },
          border: "2px solid #303F9F",
          padding: { xs: "5px", md: "10px" },
          cursor: "pointer",
          borderRadius: "10%",
          zIndex: 2,
        }}
      >
        <Typography sx={{ color: "white", fontSize: { xs: "0.8rem", md: "1rem" } }}>
          Version 1
        </Typography>
      </Box>

      <Typography
        variant="h2"
        sx={{
          color: "var(--primary-text-color)",
          zIndex: 2,
          fontSize: { xs: "2rem", md: "3rem" },
          maxWidth: "90%",
          margin: 0,
          padding: 0,
        }}
      >
        Dashboard for Database + AI
      </Typography>

      <Box 
        sx={{ 
          width: { xs: "80%", md: "50%" }, 
          aspectRatio: "16/9",
          zIndex: 2,
          margin: "20px 0",
          position: "relative"
        }}
      >
        <DotLottieReact
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "contain",
          }}
          src="/Main-Scene.lottie"
          loop
          autoplay
        />
      </Box>

      <Link to="/auth" style={{ textDecoration: 'none' }}>
        <Button
          variant="contained"
          sx={{
            bgcolor: "var(--button-background)",
            color: "var(--button-text-color)",
            ":hover": {
              bgcolor: "var(--button-hover-background)",
              transform: "scale(1.05)",
              transition: "all 0.3s ease-in-out",
            },
            zIndex: 2,
            fontSize: { xs: "0.8rem", md: "1rem" },
          }}
        >
          Explore
        </Button>
      </Link>
    </Box>
  );
}

export default HomeScreen;