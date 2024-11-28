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
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { connectDb, queryRun } from "../actions/DBActions";
import { setEncryptedItem } from "../utils/storageUtils";

const ConnectDBForm = () => {
  const dispatch = useDispatch();
  const conn = useSelector((state) => state.connectDb);
  const { error, loading, dbConn } = conn;
  const [dbType, setDbType] = useState("mysql");

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = {
      dbType: formData.get("dbType"),
      host: formData.get("host"),
      port: formData.get("port"),
      user: formData.get("user"),
      password: formData.get("password"),
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

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={2}>
          <FormControl fullWidth>
            <InputLabel id="dbType-label">DB Type</InputLabel>
            <Select
              labelId="dbType-label"
              value={dbType}
              onChange={(e) => setDbType(e.target.value)}
              name="dbType"
              disabled={loading}
            >
              <MenuItem value="mysql">MySQL</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={2}>
          <TextField
            label="Host"
            name="host"
            fullWidth
            required
            disabled={loading}
          />
        </Grid>

        <Grid item xs={2}>
          <TextField
            label="Port"
            name="port"
            fullWidth
            required
            type="number"
            disabled={loading}
          />
        </Grid>

        <Grid item xs={2}>
          <TextField
            label="User"
            name="user"
            fullWidth
            required
            disabled={loading}
          />
        </Grid>

        <Grid item xs={2}>
          <TextField
            label="Password"
            name="password"
            fullWidth
            required
            type="password"
            disabled={loading}
          />
        </Grid>

        <Grid item xs={2}>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
          >
            {loading ? "Connecting..." : "Submit"}
          </Button>
        </Grid>
      </Grid>

      {error && (
        <Box mt={2} color="error.main">
          {error?.data?.data}
        </Box>
      )}
    </Box>
  );
};

export default ConnectDBForm;
