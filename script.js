"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// 2. Element Selectors - Getting parts of our HTML
const cityInput = document.getElementById("city-input");
const searchBtn = document.getElementById("search-btn");
const weatherCard = document.getElementById("weather-card");
const errorMessage = document.getElementById("error-message");
const displayCity = document.getElementById("display-city");
const displayTemp = document.getElementById("display-temp");
const displayDesc = document.getElementById("display-desc");
const displayWind = document.getElementById("display-wind");
const displayHumidity = document.getElementById("display-humidity");
// 3. Weather Code Map - Converting numbers to words
const weatherCodes = {
    0: "Clear Sky",
    1: "Mainly Clear",
    2: "Partly Cloudy",
    3: "Overcast",
    45: "Foggy",
    48: "Depositing Rime Fog",
    51: "Light Drizzle",
    61: "Slight Rain",
    71: "Slight Snow",
    80: "Rain Showers",
    95: "Thunderstorm"
};
// 4. Core Logic - The function that fetches the weather
function get_weather(city) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Step A: Find the city coordinates (Latitude & Longitude)
            const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`;
            const geoRes = yield fetch(geoUrl);
            const geoData = yield geoRes.json();
            if (!geoData.results || geoData.results.length === 0) {
                showError();
                return;
            }
            const { latitude, longitude, name, country } = geoData.results[0];
            // Step B: Get weather for those coordinates
            const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&relative_humidity_2m=true`;
            const weatherRes = yield fetch(weatherUrl);
            const weatherDataRaw = yield weatherRes.json();
            const current = weatherDataRaw.current_weather;
            // Step C: Prepare our final data object
            const weather = {
                cityName: `${name}, ${country}`,
                temperature: current.temperature,
                windspeed: current.windspeed,
                humidity: weatherDataRaw.relative_humidity_2m || 0,
                weathercode: current.weathercode
            };
            updateUI(weather);
        }
        catch (err) {
            console.error("Error fetching weather:", err);
            showError();
        }
    });
}
// 5. UI Functions - Updating what the user sees
function updateUI(data) {
    displayCity.innerText = data.cityName;
    displayTemp.innerText = `${Math.round(data.temperature)}°C`;
    displayDesc.innerText = weatherCodes[data.weathercode] || "Cloudy";
    displayWind.innerText = `${data.windspeed} km/h`;
    displayHumidity.innerText = `${data.humidity}%`;
    weatherCard.classList.remove("hidden");
    errorMessage.classList.add("hidden");
}
function showError() {
    weatherCard.classList.add("hidden");
    errorMessage.classList.remove("hidden");
}
// 6. Event Listeners - Reacting to user clicks
searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();
    if (city) {
        get_weather(city);
    }
});
cityInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        const city = cityInput.value.trim();
        if (city)
            get_weather(city);
    }
});
