import React, { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';

const ActivationPrompt = ({ onActivate }) => {
  const [key, setKey] = useState('');
  const [error, setError] = useState('');

  const handleActivate = () => {
    // Replace 'your-secret-key' with the actual activation key
    if (key === 'letmein') {
      localStorage.setItem('emiCalculatorActivated', 'true');
      onActivate();
    } else {
      setError('Invalid activation key. Please try again.');
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Activate EMI Calculator
      </Typography>
      <TextField
        fullWidth
        label="Activation Key"
        variant="outlined"
        value={key}
        onChange={(e) => setKey(e.target.value)}
        error={!!error}
        helperText={error}
        sx={{ mb: 2 }}
      />
      <Button variant="contained" color="primary" onClick={handleActivate} fullWidth>
        Activate
      </Button>
    </Box>
  );
};

export default ActivationPrompt;