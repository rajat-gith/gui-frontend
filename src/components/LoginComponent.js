import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../actions/AuthActions";
import { useNavigate } from "react-router-dom";

const LoginComponent = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin);
  const { error, loading, userInfo } = userLogin;

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(login(email, password));
  };

  useEffect(() => {
    if (userInfo) {
      if (userInfo.status === "ok") {
        navigate("/main");
      }
      if (userInfo.status === "error") {
        alert("Invalid Credentials");
      }
    }
  }, [userInfo, navigate]);

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      noValidate
      autoComplete="off"
      sx={{
        bgcolor: "var(--card-background)",
        padding: 3,
        borderRadius: "8px",
        transition: "all 0.3s ease-in-out",
      }}
    >
      <TextField
        fullWidth
        label="Email"
        type="email"
        value={email}
        onChange={handleEmailChange}
        margin="normal"
        disabled={loading}
        variant="outlined"
        sx={{
          "& .MuiOutlinedInput-root": {
            color: "var(--primary-text-color)",
            "& fieldset": {
              borderColor: "var(--border-color)",
            },
            "&:hover fieldset": {
              borderColor: "var(--button-hover-background)",
            },
          },
          "& .MuiInputLabel-root": {
            color: "var(--secondary-text-color)",
          },
        }}
      />
      <TextField
        fullWidth
        label="Password"
        type="password"
        value={password}
        onChange={handlePasswordChange}
        margin="normal"
        disabled={loading}
        variant="outlined"
        sx={{
          "& .MuiOutlinedInput-root": {
            color: "var(--primary-text-color)",
            "& fieldset": {
              borderColor: "var(--border-color)",
            },
            "&:hover fieldset": {
              borderColor: "var(--button-hover-background)",
            },
          },
          "& .MuiInputLabel-root": {
            color: "var(--secondary-text-color)",
          },
        }}
      />
      {error && (
        <Typography color="error" variant="body2">
          {error}
        </Typography>
      )}
      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        sx={{
          marginTop: 2,
          backgroundColor: "var(--button-background)",
          color: "var(--button-text-color)",
          "&:hover": {
            backgroundColor: "var(--button-hover-background)",
          },
        }}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} /> : "Login"}
      </Button>
    </Box>
  );
};

export default LoginComponent;
