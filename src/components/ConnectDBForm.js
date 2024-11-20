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

const ConnectDBForm = () => {
  const dispatch = useDispatch();
  const conn = useSelector((state) => state.connectDb);
  const { error, loading, dbConn } = conn; // Extract state values
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

    dispatch(connectDb(data));
  };

  const fetchDatabases = () => {
    console.log(dbConn);

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
            >
              <MenuItem value="mysql">MySQL</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={2}>
          <TextField label="Host" name="host" fullWidth required />
        </Grid>

        <Grid item xs={2}>
          <TextField
            label="Port"
            name="port"
            fullWidth
            required
            type="number"
          />
        </Grid>

        <Grid item xs={2}>
          <TextField label="User" name="user" fullWidth required />
        </Grid>

        <Grid item xs={2}>
          <TextField
            label="Password"
            name="password"
            fullWidth
            required
            type="password"
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
          {error}
        </Box>
      )}
    </Box>
  );
};

export default ConnectDBForm;
