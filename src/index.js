function formatCurrentDate() {
  let now = new Date();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[now.getDay()];
  let date = now.getDate();
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let month = months[now.getMonth()];
  let hours = String(now.getHours()).padStart(2, "0");
  let minutes = String(now.getMinutes()).padStart(2, `0`);
  return `${day} ${date} ${month}<br/>Last updated at ${hours}:${minutes}`;
}

function formatForecastTime(timestamp) {
  let now = new Date(timestamp);
  let hours = String(now.getHours()).padStart(2, "0");
  let minutes = String(now.getMinutes()).padStart(2, `0`);
  return `${hours}:${minutes}`;
}

function formatSunriseSunetTime(timestamp) {
  let now = new Date(timestamp);
  let hours = String(now.getHours()).padStart(2, "0");
  let minutes = String(now.getMinutes()).padStart(2, `0`);
  return `${hours}:${minutes}`;
}

function showWeatherDataForSearchCity(event) {
  event.preventDefault();
  let cityInput = document.querySelector("#city-input");
  let apiKey = "dabd98cfd37b165b82490053d8895cbc";
  let city = cityInput.value;
  if (city === ``) {
    return;
  }
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  function handle(response) {
    handleOpenWeatherMapResponse(response.data);
  }

  function handleWeatherError(error) {
    alert("Please enter a valid city and try again");
  }

  function handleForecastError(error) {
    //Showing an alert for weather API errors already
  }

  axios.get(apiUrl).then(handle, handleWeatherError);

  apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayWeatherForecast, handleForecastError);
}

function getTemperatureForWeatherForecast(response, index) {
  let temperatureForecastCelsius = response.data.list[index].main.temp;
  temperatureForecastsCelsius[index] = temperatureForecastCelsius;
  return displayTemperature(temperatureForecastCelsius);
}

function displayWeatherForecast(response) {
  let weatherForecastElement = document.querySelector("#weather-forecast");
  weatherForecastElement.innerHTML = null;
  let weatherForecast = null;

  for (let index = 0; index < 6; index++) {
    weatherForecast = response.data.list[index];
    weatherForecastElement.innerHTML += `
            <div class="col">
              <p>
                <strong>${formatForecastTime(
                  weatherForecast.dt * 1000
                )}</strong>
                <br />
                <span id="weather-forecast-temp-${index}">
                ${getTemperatureForWeatherForecast(response, index)}</span>°
                <br />
                <img src="http://openweathermap.org/img/wn/${
                  weatherForecast.weather[0].icon
                }@2x.png" alt="">
              </p>
            </div>`;
  }
}

function handleOpenWeatherMapResponse(weatherData) {
  console.log(weatherData);
  let weatherReportElement = document.querySelector("#weather-report");
  weatherReportElement.style.display = "block";

  let currentDateElement = document.querySelector(".current-date");
  currentDateElement.innerHTML = formatCurrentDate();

  temperatureCelsius = weatherData.main.temp;

  let temperatureElement = document.querySelector("#temperature-digits");
  temperatureElement.innerHTML = displayTemperature(temperatureCelsius);

  temperatureMinCelsius = weatherData.main.temp_min;
  let temperatureMinElement = document.querySelector("#min-temp");
  temperatureMinElement.innerHTML = displayTemperature(temperatureMinCelsius);

  temperatureMaxCelsius = weatherData.main.temp_max;
  let temperatureMaxElement = document.querySelector("#max-temp");
  temperatureMaxElement.innerHTML = displayTemperature(temperatureMaxCelsius);

  let humidity = Math.round(weatherData.main.humidity);
  let humidityElement = document.querySelector("#humidity");
  humidityElement.innerHTML = humidity;

  let windSpeed = Math.round(weatherData.wind.speed);
  let windElement = document.querySelector("#wind-speed");
  windElement.innerHTML = windSpeed;

  let currentCity = weatherData.name;
  let currentCityElement = document.querySelector("#current-city");
  currentCityElement.innerHTML = currentCity;

  let currentCountry = weatherData.sys.country;
  let currentCountryElement = document.querySelector("#current-country");
  currentCountryElement.innerHTML = currentCountry;

  let currentWeatherDescription = weatherData.weather[0].description;
  let currentWeatherDescriptionElement = document.querySelector(
    "#weather-description"
  );
  currentWeatherDescriptionElement.innerHTML = currentWeatherDescription;

  let sunriseTime = weatherData.sys.sunrise;
  let sunriseTimeElement = document.querySelector("#sunrise-time");
  sunriseTimeElement.innerHTML = formatSunriseSunetTime(sunriseTime * 1000);

  let sunsetTime = weatherData.sys.sunset;
  let sunsetTimeElement = document.querySelector("#sunset-time");
  sunsetTimeElement.innerHTML = formatSunriseSunetTime(sunsetTime * 1000);

  let weatherIconElement = document.querySelector("#current-weather-icon");
  weatherIconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`
  );
}

function showWeatherDataForLocation(position) {
  console.log("position is", position);
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let apiKey = "dabd98cfd37b165b82490053d8895cbc";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

  function handle(response) {
    handleOpenWeatherMapResponse(response.data);
  }

  axios.get(apiUrl).then(handle);
  apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayWeatherForecast);
}

function showWeatherDataForCurrentLocation() {
  navigator.geolocation.getCurrentPosition(showWeatherDataForLocation);
}

function updateTemperatureToFahrenheit(event) {
  event.preventDefault();
  updateTemperature("fahrenheit");
}

function updateTemperatureToCelsius(event) {
  event.preventDefault();
  updateTemperature("celsius");
}

function calculateFahrenheit(temperatureCelsius) {
  return (temperatureCelsius * 9) / 5 + 32;
}

function displayTemperature(temperatureCelsius) {
  if (temperatureUnit === "celsius") {
    return Math.round(temperatureCelsius);
  } else {
    return Math.round(calculateFahrenheit(temperatureCelsius));
  }
}

function updateTemperature(unit) {
  temperatureUnit = unit;

  if (unit == "fahrenheit") {
    changetoCelsius.classList.remove("active");
    changeToFahrenheit.classList.add("active");
  } else {
    changeToFahrenheit.classList.remove("active");
    changetoCelsius.classList.add("active");
  }

  let temperatureElement = document.querySelector("#temperature-digits");
  temperatureElement.innerHTML = displayTemperature(temperatureCelsius);

  let temperatureMinElement = document.querySelector("#min-temp");
  temperatureMinElement.innerHTML = displayTemperature(temperatureMinCelsius);

  let temperatureMaxElement = document.querySelector("#max-temp");
  temperatureMaxElement.innerHTML = displayTemperature(temperatureMaxCelsius);

  for (let index = 0; index < 6; index++) {
    let element = document.querySelector(`#weather-forecast-temp-${index}`);
    element.innerHTML = displayTemperature(temperatureForecastsCelsius[index]);
  }
}

let temperatureCelsius = null;
let temperatureMaxCelsius = null;
let temperatureMinCelsus = null;
let temperatureForecastsCelsius = [];
let temperatureUnit = "celsius";

let searchButton = document.querySelector("#city-form");
searchButton.addEventListener("click", showWeatherDataForSearchCity);

let currentCityButton = document.querySelector("#current-city-button");
currentCityButton.addEventListener("click", showWeatherDataForCurrentLocation);

let changeToFahrenheit = document.querySelector("#fahrenheit");
changeToFahrenheit.addEventListener("click", updateTemperatureToFahrenheit);

let changetoCelsius = document.querySelector("#celsius");
changetoCelsius.addEventListener("click", updateTemperatureToCelsius);

window.addEventListener("load", showWeatherDataForCurrentLocation);
