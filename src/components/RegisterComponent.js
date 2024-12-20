import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { register } from "../actions/AuthActions";

const RegisterComponent = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userRegister = useSelector((state) => state.userRegister);
  const { error, loading, userInfo } = userRegister;

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    dispatch(register(name, email, password));
  };

  useEffect(() => {
    if (userInfo) {
      if (userInfo.status === "ok") {
        navigate("/main");
      } else {
        alert("Invalid Credentials");
      }
    }
  }, [userInfo, navigate]);

  return (
    <Box
      component="form"
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
        label="Name"
        type="text"
        margin="normal"
        onChange={handleNameChange}
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
        label="Email"
        type="email"
        margin="normal"
        onChange={handleEmailChange}
        variant="outlined"
        disabled={loading}
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
        margin="normal"
        disabled={loading}
        onChange={handlePasswordChange}
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
        onClick={handleSubmit}
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
        {loading ? <CircularProgress size={24} /> : "Register"}
      </Button>
    </Box>
  );
};

export default RegisterComponent;
