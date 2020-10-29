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
  return `${day} ${date} ${month} ${hours}:${minutes}`;
}

function showWeatherDataForSearchCity(event) {
  event.preventDefault();
  let cityInput = document.querySelector("#city-input");
  let apiKey = "dabd98cfd37b165b82490053d8895cbc";
  let city = cityInput.value;
  if (city === ``) {
    return;
  }
  let apiUrl = `https://api.openweathermap.org/data/2.5/find?q=${city}&appid=${apiKey}&units=metric`;

  function handle(response) {
    if (response.data.list.length === 0) {
      alert("Please enter a city");
      return;
    }
    handleOpenWeatherMapResponse(response.data.list[0]);
  }

  axios.get(apiUrl).then(handle);
}

function handleOpenWeatherMapResponse(weatherData) {
  let weatherReportElement = document.querySelector("#weather-report");
  weatherReportElement.style.display = "block";

  let currentDate = document.querySelector(".current-date");
  currentDate.innerHTML = formatCurrentDate();

  let temperature = Math.round(weatherData.main.temp);
  let temperatureElement = document.querySelector("#temperature-digits");
  temperatureElement.innerHTML = temperature;

  let humidity = Math.round(weatherData.main.humidity);
  let humidityElement = document.querySelector("#humidity");
  humidityElement.innerHTML = humidity;

  let windSpeed = Math.round(weatherData.wind.speed);
  let windElement = document.querySelector("#wind-speed");
  windElement.innerHTML = windSpeed;

  let currentCity = weatherData.name;
  let currentCityElement = document.querySelector("#current-city");
  currentCityElement.innerHTML = currentCity;
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
}

function showWeatherDataForCurrentLocation() {
  navigator.geolocation.getCurrentPosition(showWeatherDataForLocation);
}

let searchButton = document.querySelector("#city-form");
searchButton.addEventListener("click", showWeatherDataForSearchCity);

let currentCityButton = document.querySelector("#current-city-button");
currentCityButton.addEventListener("click", showWeatherDataForCurrentLocation);