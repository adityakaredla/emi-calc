import React, { useState, useEffect } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import InputAdornment from "@mui/material/InputAdornment";
import ActivationPrompt from "./ActivationPrompt";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
  },
});

function App() {
  const [isActivated, setIsActivated] = useState(false);
  const [loanAmount, setLoanAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [loanTerm, setLoanTerm] = useState("");
  const [emi, setEmi] = useState(null);
  const [totalInterest, setTotalInterest] = useState(null);
  const [totalAmount, setTotalAmount] = useState(null);

  useEffect(() => {
    const activated = localStorage.getItem("emiCalculatorActivated");
    if (activated === "true") {
      setIsActivated(true);
    }
  }, []);

  const calculateEMI = () => {
    const principal = parseFloat(loanAmount);
    const rate = parseFloat(interestRate) / 100 / 12;
    const time = parseFloat(loanTerm) * 12;

    if (principal > 0 && rate > 0 && time > 0) {
      const emiValue =
        (principal * rate * Math.pow(1 + rate, time)) /
        (Math.pow(1 + rate, time) - 1);
      const totalPayment = emiValue * time;
      const interestPayment = totalPayment - principal;

      setEmi(emiValue.toFixed(2));
      setTotalInterest(interestPayment.toFixed(2));
      setTotalAmount(totalPayment.toFixed(2));
    }
  };

  const handleActivate = () => {
    setIsActivated(true);
  };

  if (!isActivated) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container maxWidth="sm">
          <ActivationPrompt onActivate={handleActivate} />
        </Container>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="sm">
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            EMI Calculator
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Loan Amount"
                variant="outlined"
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">₹</InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Interest Rate"
                variant="outlined"
                type="number"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">%</InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Loan Term (Years)"
                variant="outlined"
                type="number"
                value={loanTerm}
                onChange={(e) => setLoanTerm(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                onClick={calculateEMI}
                fullWidth
              >
                Calculate EMI
              </Button>
            </Grid>
          </Grid>
          {emi && (
            <Box
              sx={{
                mt: 4,
                p: 3,
                bgcolor: "background.paper",
                borderRadius: 2,
                boxShadow: 1,
              }}
            >
              <Typography
                variant="h5"
                gutterBottom
                fontWeight="bold"
                color="primary"
              >
                Results
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Typography variant="subtitle1" color="text.secondary">
                    Monthly EMI
                  </Typography>
                  <Typography variant="h6" fontWeight="bold">
                    ₹{emi}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="subtitle1" color="text.secondary">
                    Total Interest
                  </Typography>
                  <Typography variant="h6" fontWeight="bold">
                    ₹{totalInterest}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="subtitle1" color="text.secondary">
                    Total Amount
                  </Typography>
                  <Typography variant="h6" fontWeight="bold">
                    ₹{totalAmount}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          )}
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
