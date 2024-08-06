import React, { useState, useEffect } from "react";
import { Container, TextField, Button, Typography, Grid, Box } from "@mui/material";


const Settings = ({ onSave }) => {
  const [agreementCharges, setAgreementCharges] = useState(0);
  const [stampingCharges, setStampingCharges] = useState(0);
  const [insurance, setInsurance] = useState(0);
  const [extra1, setExtra1] = useState(0);
  const [extra2, setExtra2] = useState(0);
  const [advanceEmi, setAdvanceEmi] = useState(0);
  const [interestRateDefault, setInterestRateDefault] = useState(null);

  useEffect(() => {
    const settings = JSON.parse(localStorage.getItem("emiCalculatorSettings"));
    if (settings) {
      setAgreementCharges(settings.agreementCharges);
      setStampingCharges(settings.stampingCharges);
      setInsurance(settings.insurance);
      setExtra1(settings.extra1);
      setExtra2(settings.extra2);
      setAdvanceEmi(settings.advanceEmi);
      setInterestRateDefault(settings.interestRateDefault);
    }
  }, []);


  const handleSave = () => {
    const settings = {
      agreementCharges,
      stampingCharges,
      insurance,
      extra1,
      extra2,
      advanceEmi,
      interestRateDefault,
    };
    localStorage.setItem("emiCalculatorSettings", JSON.stringify(settings));
    onSave();
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Settings
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Button
              variant="outlined"
              color="primary"
              onClick={onSave} // Use navigate to go back
              fullWidth
            >
              Back
            </Button>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Agreement Charges (%)"
              variant="outlined"
              type="number"
              value={agreementCharges}
              onChange={(e) => setAgreementCharges(parseFloat(e.target.value))}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Stamping Charges (Rs.)"
              variant="outlined"
              type="number"
              value={stampingCharges}
              onChange={(e) => setStampingCharges(parseFloat(e.target.value))}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Insurance (Rs.)"
              variant="outlined"
              type="number"
              value={insurance}
              onChange={(e) => setInsurance(parseFloat(e.target.value))}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Extra1 (Rs.)"
              variant="outlined"
              type="number"
              value={extra1}
              onChange={(e) => setExtra1(parseFloat(e.target.value))}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Extra2 (Rs.)"
              variant="outlined"
              type="number"
              value={extra2}
              onChange={(e) => setExtra2(parseFloat(e.target.value))}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Advance EMI Default Value"
              variant="outlined"
              type="number"
              value={advanceEmi}
              onChange={(e) => setAdvanceEmi(parseFloat(e.target.value))}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Interest Rate Default Value (%)"
              variant="outlined"
              type="number"
              value={interestRateDefault}
              onChange={(e) => setInterestRateDefault(parseFloat(e.target.value))}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              fullWidth
            >
              Save
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Settings;