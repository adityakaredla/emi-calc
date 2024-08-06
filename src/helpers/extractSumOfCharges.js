const extractSumOfCharges = () => {
    const settings = JSON.parse(localStorage.getItem("emiCalculatorSettings")) || null;
    if (settings) {
      const sum =  
      (parseFloat(settings.stampingCharges) || 0) + 
      (parseFloat(settings.insurance) || 0) + 
      (parseFloat(settings.extra1) || 0) + 
      (parseFloat(settings.extra2) || 0);
    return sum || 0;
    }
    return 0;
  }

export default extractSumOfCharges;