const apiURL =
  "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=AMZN&interval=5min&apikey=IG5ZWA65EPEAGGC8";

export async function fetchData(endpoint) {
  try {
    const response = await fetch(`${apiURL}${endpoint}`);
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    throw error;
  }
}
