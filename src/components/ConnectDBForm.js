import React, { useState, useEffect } from "react";
import {
  TextField,
  Grid,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Modal,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { connectDb, queryRun } from "../actions/DBActions";
import { setEncryptedItem } from "../utils/storageUtils";

const ConnectDBForm = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const conn = useSelector((state) => state.connectDb);
  const { error, loading, dbConn } = conn;
  const [dbType, setDbType] = useState("mysql");

  const fields = [
    { label: "Host", name: "host", type: "text", required: true },
    { label: "Port", name: "port", type: "number", required: true },
    { label: "User", name: "user", type: "text", required: true },
    { label: "Password", name: "password", type: "password", required: true },
  ];

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = {
      dbType: formData.get("dbType"),
      ...Object.fromEntries(fields.map((field) => [field.name, formData.get(field.name)])),
    };
    setEncryptedItem("conn", JSON.stringify(data));
    dispatch(connectDb(data));
  };

  const fetchDatabases = () => {
    if (dbConn) {
      dispatch(queryRun("SHOW DATABASES"));
    }
  };
  useEffect(() => {
    if (dbConn) {
      fetchDatabases();
    }
  }, [dbConn]);

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: { xs: "90%", sm: 600 },
    bgcolor: "var(--background-color)",
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="database-connection-modal"
      aria-describedby="database-connection-form"
    >
      <Box sx={modalStyle}>
        <Typography
          id="database-connection-modal"
          variant="h6"
          component="h2"
          sx={{
            color: "var(--primary-text-color)",
            mb: 2,
            textAlign: "center",
          }}
        >
          Database Connection
        </Typography>
        <Box
          sx={{
            "& .MuiInputBase-root": {
              bgcolor: "var(--background-color)",
              color: "var(--primary-text-color)",
            },
          }}
          component="form"
          onSubmit={handleSubmit}
          noValidate
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel
                  id="dbType-label"
                  sx={{
                    color: "var(--secondary-text-color)",
                    fontWeight: "bold",
                    fontFamily: "Arial",
                    "&.Mui-focused": {
                      color: "var(--button-background)",
                    },
                  }}
                >
                  DB Type
                </InputLabel>
                <Select
                  labelId="dbType-label"
                  value={dbType}
                  onChange={(e) => setDbType(e.target.value)}
                  name="dbType"
                  disabled={loading}
                  sx={{
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "var(--button-background)",
                      borderWidth: "2px",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "var(--button-hover-background)",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "var(--button-hover-background)",
                    },
                    color: "var(--primary-text-color)",
                    fontFamily: "Arial",
                    fontWeight: "bold",
                    backgroundColor: "var(--background-color)",
                  }}
                >
                  <MenuItem value="mysql">MySQL</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {fields.map((field, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <TextField
                  label={field.label}
                  name={field.name}
                  fullWidth
                  required={field.required}
                  type={field.type}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      color: "var(--primary-text-color)",
                      fontFamily: "Arial",
                      fontWeight: "bold",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "var(--button-background)",
                        borderWidth: "2px",
                      },
                    },
                    "& .MuiInputLabel-outlined": {
                      color: "var(--secondary-text-color)",
                      fontWeight: "bold",
                    },
                  }}
                  disabled={loading}
                />
              </Grid>
            ))}

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                sx={{
                  mt: 2,
                  backgroundColor: "var(--button-background)",
                  color: "var(--button-text-color)",
                  "&:hover": {
                    backgroundColor: "var(--button-hover-background)",
                  },
                  "&.Mui-disabled": {
                    backgroundColor: "var(--suggest-button-background)",
                    color: "var(--button-text-color)",
                  },
                }}
              >
                {loading ? "Connecting..." : "Submit"}
              </Button>
            </Grid>
          </Grid>

          {error && (
            <Box
              mt={2}
              sx={{
                color: "var(--error-color)",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              {error?.data?.data}
            </Box>
          )}
        </Box>
      </Box>
    </Modal>
  );
};

export default ConnectDBForm;
