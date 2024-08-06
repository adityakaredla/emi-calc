import React, { useState, useEffect, useRef } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import InputAdornment from "@mui/material/InputAdornment";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import ActivationPrompt from "./ActivationPrompt";
import Settings from "./Settings";
import extractSumOfCharges from "./helpers/extractSumOfCharges";



const settings = JSON.parse(localStorage.getItem("emiCalculatorSettings")) || {};

function App() {
  const [isActivated, setIsActivated] = useState(false);
  const [onRoadCost, setOnRoadCost] = useState("");
  const [interestRate, setInterestRate] = useState(settings.interestRateDefault);
  const [tenure, setTenure] = useState("");
  const [advanceEmi, setAdvanceEmi] = useState(settings.advanceEmi || 0);
  const [emi, setEmi] = useState("");
  const [downPayment, setDownPayment] = useState("");
  const [loanAmount, setLoanAmount] = useState(null);
  const [totalInterest, setTotalInterest] = useState(null);
  const [totalAmount, setTotalAmount] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [inputMode, setInputMode] = useState("emi");
  const resultsRef = useRef(null);

  useEffect(() => {
    const activated = localStorage.getItem("emiCalculatorActivated");
    if (activated === "true") {
      setIsActivated(true);
    }
  }, []);

  const scrollToResults = () => {
    if (resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  function calculatePercentage(x, y) {
    x = parseFloat(x);
  
    if (isNaN(x) || isNaN(y)) {
      return 0;
    }
  
    return (x / 100) * y;
  }
  
  const calculateEMI = () => {
    if (!onRoadCost || !interestRate || !tenure || !downPayment) {
      alert("Please fill in all fields.");
      return;
    }
    const extraCharges = extractSumOfCharges();
    const convertedDownPayment = parseFloat(downPayment)
    const principal = parseFloat(onRoadCost) - convertedDownPayment+ parseFloat(extraCharges) + calculatePercentage(settings.agreementCharges,parseFloat(onRoadCost - downPayment));
    console.log(parseFloat(extraCharges),calculatePercentage(settings.agreementCharges,parseFloat(onRoadCost - downPayment)))
    const rate = parseFloat(interestRate) / 100 / 12;
    const time = parseFloat(tenure); // Adjust tenure

    if (principal > 0 && rate > 0 && time > 0) {
      const emiValue = (principal * rate * Math.pow(1 + rate, time)) / (Math.pow(1 + rate, time) - 1);
      const totalPayment = emiValue * time;
      const interestPayment = totalPayment - principal;
      console.log({emiValue,totalPayment,interestPayment,downPayment})
      setEmi(emiValue.toFixed(2));
      setTotalInterest(interestPayment.toFixed(2));
      setTotalAmount((totalPayment + convertedDownPayment).toFixed(2)); // Add advance EMI to total amount
      setLoanAmount(principal.toFixed(2));
      scrollToResults(); // Scroll to results after calculation
    }
  };

  const calculateDownPayment = () => {
    if (!onRoadCost || !interestRate || !tenure || !emi) {
      alert("Please fill in all fields.");
      return;
    }

    const emiValue = parseFloat(emi);
    const rate = parseFloat(interestRate) / 100 / 12;
    const time = parseFloat(tenure); // Adjust tenure
    const extraCharges = parseFloat(extractSumOfCharges());

    if (emiValue > 0 && rate > 0 && time > 0) {
      const principal = parseFloat((emiValue * (Math.pow(1 + rate, time) - 1)) / (rate * Math.pow(1 + rate, time)));
      const tempDownPayment = parseFloat(onRoadCost) - principal + extraCharges + (parseFloat(advanceEmi) * emiValue) + calculatePercentage(settings.agreementCharges,principal);
      const totalPayment = emiValue * time;
      const interestPayment = totalPayment - principal;

      setDownPayment(tempDownPayment.toFixed(2));
      setTotalInterest(interestPayment.toFixed(2));
      setTotalAmount((tempDownPayment + (emiValue * parseFloat(time - advanceEmi))).toFixed(2));
      setLoanAmount(principal.toFixed(2));
      scrollToResults(); // Scroll to results after calculation
    }
  };

  const handleActivate = () => {
    setIsActivated(true);
  };

  const handleSaveSettings = () => {
    setShowSettings(false);
  };

  if (!isActivated) {
    return (
      <>
        <CssBaseline />
        <Container maxWidth="sm">
          <ActivationPrompt onActivate={handleActivate} />
        </Container>
        </>
    );
  }

  if (showSettings) {
    return <Settings onSave={handleSaveSettings} />;
  }

  return (
    <>
      <CssBaseline />
      <Container maxWidth="sm">
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            EMI Calculator
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setShowSettings(true)}
            fullWidth
            sx={{ mb: 3 }}
          >
            Settings
          </Button>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="On Road Cost"
                variant="outlined"
                type="number"
                value={onRoadCost}
                onChange={(e) => setOnRoadCost(e.target.value)}
                InputProps={{
                  startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                }}
                required
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
                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                }}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tenure (Months)"
                variant="outlined"
                type="number"
                value={tenure}
                onChange={(e) => setTenure(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Advance EMI"
                variant="outlined"
                type="number"
                value={advanceEmi}
                onChange={(e) => setAdvanceEmi(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <RadioGroup
                row
                value={inputMode}
                onChange={(e) => {
                  setInputMode(e.target.value);
                  setEmi("");
                  setDownPayment("");
                  setTotalInterest(null);
                  setTotalAmount(null);
                }}
              >
                <FormControlLabel value="emi" control={<Radio />} label="Enter EMI" />
                <FormControlLabel value="downPayment" control={<Radio />} label="Enter Down Payment" />
              </RadioGroup>
            </Grid>
            {inputMode === "emi" ? (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="EMI"
                  variant="outlined"
                  type="number"
                  value={emi}
                  onChange={(e) => setEmi(e.target.value)}
                  required
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={calculateDownPayment}
                  fullWidth
                  sx={{ mt: 2 }}
                >
                  Calculate
                </Button>
              </Grid>
            ) : (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Down Payment"
                  variant="outlined"
                  type="number"
                  value={downPayment}
                  onChange={(e) => setDownPayment(e.target.value)}
                  required
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={calculateEMI}
                  fullWidth
                  sx={{ mt: 2 }}
                >
                  Calculate
                </Button>
              </Grid>
            )}
          </Grid>
          {emi && downPayment && loanAmount && totalInterest && totalAmount && (
            <Box
              sx={{
                mt: 4,
                p: 3,
                bgcolor: "background.paper",
                borderRadius: 2,
                boxShadow: 1,
              }}
            >
              <Typography variant="h5" gutterBottom fontWeight="bold" color="primary">
                Results
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Typography variant="subtitle1" color="text.secondary">
                    Monthly EMI
                  </Typography>
                  <Typography variant="h6" fontWeight="bold">
                    ₹{emi} {inputMode === 'emi' && tenure && advanceEmi && <i>* for <b>{tenure - advanceEmi}</b> months</i>}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="subtitle1" color="text.secondary">
                    Down Payment 
                  </Typography>
                  <Typography variant="h6" fontWeight="bold">
                    ₹{downPayment} {inputMode === 'emi' && tenure && advanceEmi > 0 && <i><b>(including {advanceEmi} monthsof Advance EMI)</b></i>}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="subtitle1" color="text.secondary">
                    Loan Amount
                  </Typography>
                  <Typography variant="h6" fontWeight="bold">
                    ₹{loanAmount}
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
      <div ref={resultsRef} />
    </>
  );
}

export default App;