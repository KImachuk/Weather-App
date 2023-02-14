"use strict";
const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const ejs = require("ejs");
require("dotenv").config();
const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
// ejs request
app.get("/", (req, res) => {
  res.render("weather", { name: "Ivan" });
});

// app request
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public");
});

app.post("/", (req, res) => {
  let city = req.body.cityName;
  const querry = city;
  const apiKey = process.env.WEATHER_API_KEY;
  const units = "units=metric";
  const url =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    querry +
    "&appid=" +
    apiKey +
    "&" +
    units;
  https.get(url, (response) => {
    console.log(response.statusCode);
    if (response.statusCode === 200) {
      response.on("data", (data) => {
        const weahterData = JSON.parse(data);
        const tempr = weahterData.main.temp;
        const description = weahterData.weather[0].description;
        const cityName = weahterData.name;
        const icon = weahterData.weather[0].icon;
        const urlImg = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
        res.render("success", {
          city: cityName,
          temprature: tempr,
          sky: description,
          img: urlImg,
        });
      });
    } else {
      res.sendFile(__dirname + "/public/fail.html");
    }
  });
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server start on port 3000 `);
});
