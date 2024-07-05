import express from "express";
import axios from "axios";

const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // or specify the domain you want
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

app.get("/", async (req, res) => {
  const pv = req.query.pv;
  console.log("Received GET request", pv);
  try {
    const response = await axios.get(
      `https://www.tmd.go.th/api/WeatherForecast7Day/weather-forecast-7day-by-province?Sorting=weatherForecast7Day.recordTime%20asc&FilterText=%E0%B8%81%E0%B8%A3%E0%B8%B8%E0%B8%87%E0%B9%80%E0%B8%97%E0%B8%9E%E0%B8%A1%E0%B8%AB%E0%B8%B2%E0%B8%99%E0%B8%84%E0%B8%A3&MaxResultCount=7&culture=th-TH`
    );
    console.log(response.data); // Log the data before sending the response
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching data from API:", error);
    res.status(500).send("Error fetching data from API");
  }
});

app.post("/", (req, res) => {
  console.log("Received POST request");
  res.send("POST request");
});

const PORT = 4000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
