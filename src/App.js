import React, { useState, useEffect } from "react";
import "./App.css";
import "@fontsource/roboto/500.css";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { outlinedInputClasses } from "@mui/material/OutlinedInput";
import { fetchData } from "./backend/api";

import { createTheme, ThemeProvider, useTheme } from "@mui/material/styles";

const customTheme = (outerTheme) =>
  createTheme({
    palette: {
      mode: outerTheme.palette.mode,
    },
    components: {
      MuiTextField: {
        styleOverrides: {
          root: {
            "--TextField-brandBorderColor": "#76E3D7",
            "--TextField-brandBorderHoverColor": "#007367",
            "--TextField-brandBorderFocusedColor": "#9CE6DE",
            "& label.Mui-focused": {
              color: "var(--TextField-brandBorderFocusedColor)",
            },
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          notchedOutline: {
            borderColor: "var(--TextField-brandBorderColor)",
          },
          root: {
            [`&:hover  .${outlinedInputClasses.notchedOutline}`]: {
              borderColor: "var(--TextField-brandBorderHoverColor)",
            },
            [`&.Mui-focused .${outlinedInputClasses.notchedOutline}`]: {
              borderColor: "var(--TextField-brandBorderFocusedColor)",
            },
          },
        },
      },
      MuiFilledInput: {
        styleOverrides: {
          root: {
            "&:before, &:after": {
              borderBottom: "2px solid var(--TextField-brandBorderColor)",
            },
            "&:hover:not(.Mui-disabled, .Mui-error):before": {
              borderBottom: "2px solid var(--TextField-brandBorderHoverColor)",
            },
            "&.Mui-focused:after": {
              borderBottom:
                "2px solid var(--TextField-brandBorderFocusedColor)",
            },
          },
        },
      },
      MuiInput: {
        styleOverrides: {
          root: {
            "&:before": {
              borderBottom: "2px solid var(--TextField-brandBorderColor)",
            },
            "&:hover:not(.Mui-disabled, .Mui-error):before": {
              borderBottom: "2px solid var(--TextField-brandBorderHoverColor)",
            },
            "&.Mui-focused:after": {
              borderBottom:
                "2px solid var(--TextField-brandBorderFocusedColor)",
            },
          },
        },
      },
    },
  });

function App() {
  const [age, setAge] = useState("");
  const [apiURL, setApiURL] = useState("");
  const [stockAmount, setStockAmount] = useState(""); // Estado para el valor ingresado por el usuario
  const [result, setResult] = useState(null); // Estado para mostrar el resultado
  const outerTheme = useTheme();
  const apiURLTemplate =
    "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=COMPANY_SYMBOL&interval=5min&apikey=IG5ZWA65EPEAGGC8";

  function handleChange(event) {
    const selectedSymbol = event.target.value;
    setAge(selectedSymbol);

    const updatedURL = apiURLTemplate.replace("COMPANY_SYMBOL", selectedSymbol);
    setApiURL(updatedURL);
  }

  function calculateStocks() {
    fetchData(apiURL)
      .then((response) => {
        const timeSeries = response["Time Series (5min)"];

        // Verifica si timeSeries es un valor válido
        if (timeSeries) {
          const filteredData = Object.keys(timeSeries)
            .map((innerKey) => timeSeries[innerKey]["1. open"])
            .find((val) => val !== undefined);

          if (stockAmount && filteredData) {
            const calculatedResult = (
              parseFloat(stockAmount) * parseFloat(filteredData)
            ).toFixed(2);
            const crTaxes = 0.25;
            const withTaxes = (
              parseFloat(calculatedResult) -
              parseFloat(calculatedResult) * crTaxes
            ).toFixed(2);
            if (isNaN(calculatedResult)) {
              setResult(null);
            } else {
              setResult([calculatedResult, withTaxes]);
            }
          }
        } else {
          setResult(null); // No hay datos válidos para calcular
        }
      })
      .catch((error) => console.log(error));
  }

  React.useEffect(() => {
    setAge("AMZN");
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1 style={{ fontFamily: "Roboto, sans-serif" }}>Stocks Calculator</h1>
        <Stack spacing={2} direction="row">
          <Box
            sx={{
              borderRadius: "0.5rem",
              borderColor: "primary.dark",
              width: "10rem",
              height: "3.6rem",
              backgroundColor: "#A24C00",
              "&:hover": {
                backgroundColor: "#E7720B",
              },
            }}
          >
            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="stockSymbol-label">Stock Symbol</InputLabel>
              <Select
                labelId="stockSymbol"
                id="stockSymbol"
                value={age}
                onChange={handleChange}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value="AMZN">AMZN</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <ThemeProvider theme={customTheme(outerTheme)}>
            <TextField
              id="outlined-basic"
              value={stockAmount}
              label="Enter Amount"
              variant="outlined"
              color="secondary"
              focused
              onChange={(e) => setStockAmount(e.target.value)}
            />
          </ThemeProvider>
        </Stack>
        <Stack spacing={2} direction="row">
          <Button
            onClick={calculateStocks}
            style={{ marginTop: "1rem" }}
            variant="contained"
          >
            Calculate
          </Button>
        </Stack>

        {result !== null ? (
          <div>
            <p style={{ fontFamily: "Roboto, sans-serif" }}>
              Your stocks amount is: ${result[0]} USD
            </p>
            <p style={{ fontFamily: "Roboto, sans-serif" }}>
              Your stocks amount with taxes is: ${result[1]} USD
            </p>
          </div>
        ) : (
          <p style={{ fontFamily: "Roboto, sans-serif" }}>
            Only numbers are allowed
          </p>
        )}
        <p></p>
        <p style={{ fontFamily: "Roboto, sans-serif" }}>
          This page is just for fun, but the information is true, I swear :)
        </p>
      </header>
    </div>
  );
}

export default App;
