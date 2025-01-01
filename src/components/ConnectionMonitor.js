import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Stack,
  Chip,
  keyframes
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon
} from '@mui/icons-material';

const blink = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
`;

const StatusPaper = styled(Paper)(({ connectionStatus }) => ({
  backgroundColor: 'var(--card-background)',
  border: '1px solid var(--border-color)',
  padding: '12px',
  width: 'auto',
  '& .MuiSvgIcon-root': {
    animation: connectionStatus === 'connected' ? `${blink} 2s ease-in-out infinite` : 'none',
  }
}));

const StatusChip = styled(Chip)(({ connectionStatus }) => ({
  backgroundColor: 'transparent',
  color: connectionStatus === 'connected' ? 'var(--success-color)' : 'var(--error-color)',
  borderColor: connectionStatus === 'connected' ? 'var(--success-color)' : 'var(--error-color)',
  '& .MuiChip-label': {
    fontSize: '0.75rem',
  }
}));

const TimeText = styled(Typography)({
  color: 'var(--secondary-text-color)',
  fontSize: '0.75rem'
});

const ErrorText = styled(Typography)({
  color: 'var(--error-color)',
  fontSize: '0.75rem'
});

const ConnectionMonitor = () => {
  const [status, setStatus] = useState('disconnected');
  const [lastChecked, setLastChecked] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const userId = 'user-' + Math.random().toString(36).substr(2, 9);
    const host = process.env.REACT_APP_WEBSOCKET_URL;
    const wsUrl = `wss://${host}`;

    const ws = new WebSocket(`${wsUrl}?userId=${userId}`);


    ws.onopen = () => {
      console.log('WebSocket Connected');
      localStorage.setItem('isDbConnected', 'true');
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setStatus(data.status);
        setLastChecked(data.timestamp);
        if (data.status === 'connected') {
          localStorage.setItem('isDbConnected', 'true');
        } else {
          localStorage.setItem('isDbConnected', 'false');
        }
      } catch (err) {
        console.error('Error parsing WebSocket message:', err);
        setError('Failed to parse server response');
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setError('Connection error');
      setStatus('disconnected');
      localStorage.setItem('isDbConnected', 'false');
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
      setStatus('disconnected');
      localStorage.setItem('isDbConnected', 'false');
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, []);

  return (
    <StatusPaper connectionStatus={status}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
        <Stack direction="row" spacing={1} alignItems="center">
          {status === 'connected' ? (
            <CheckCircleIcon sx={{ color: 'var(--success-color)', fontSize: 20 }} />
          ) : (
            <ErrorIcon sx={{ color: 'var(--error-color)', fontSize: 20 }} />
          )}
          <StatusChip
            label={status.charAt(0).toUpperCase() + status.slice(1)}
            connectionStatus={status}
            size="small"
          />
        </Stack>
        <TimeText>
          {lastChecked ? new Date(lastChecked).toLocaleTimeString() : 'Never'}
        </TimeText>
      </Stack>
      {error && (
        <ErrorText sx={{ mt: 0.5 }}>
          {error}
        </ErrorText>
      )}
    </StatusPaper>
  );
};

export default ConnectionMonitor;
