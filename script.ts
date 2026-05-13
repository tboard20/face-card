// 1. Types - Defining what our data looks like
interface WeatherData {
    temperature: number;
    windspeed: number;
    humidity: number;
    weathercode: number;
    cityName: string;
}

// 2. Element Selectors - Getting parts of our HTML
const cityInput = document.getElementById("city-input") as HTMLInputElement;
const searchBtn = document.getElementById("search-btn") as HTMLButtonElement;
const weatherCard = document.getElementById("weather-card") as HTMLElement;
const errorMessage = document.getElementById("error-message") as HTMLElement;

const displayCity = document.getElementById("display-city") as HTMLElement;
const displayTemp = document.getElementById("display-temp") as HTMLElement;
const displayDesc = document.getElementById("display-desc") as HTMLElement;
const displayWind = document.getElementById("display-wind") as HTMLElement;
const displayHumidity = document.getElementById("display-humidity") as HTMLElement;

// 3. Weather Code Map - Converting numbers to words
const weatherCodes: { [key: number]: string } = {
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
async function get_weather(city: string): Promise<void> {
    try {
        // Step A: Find the city coordinates (Latitude & Longitude)
        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`;
        const geoRes = await fetch(geoUrl);
        const geoData = await geoRes.json();

        if (!geoData.results || geoData.results.length === 0) {
            showError();
            return;
        }

        const { latitude, longitude, name, country } = geoData.results[0];

        // Step B: Get weather for those coordinates
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&relative_humidity_2m=true`;
        const weatherRes = await fetch(weatherUrl);
        const weatherDataRaw = await weatherRes.json();

        const current = weatherDataRaw.current_weather;
        
        // Step C: Prepare our final data object
        const weather: WeatherData = {
            cityName: `${name}, ${country}`,
            temperature: current.temperature,
            windspeed: current.windspeed,
            humidity: weatherDataRaw.relative_humidity_2m || 0,
            weathercode: current.weathercode
        };

        updateUI(weather);
    } catch (err) {
        console.error("Error fetching weather:", err);
        showError();
    }
}

// 5. UI Functions - Updating what the user sees
function updateUI(data: WeatherData): void {
    displayCity.innerText = data.cityName;
    displayTemp.innerText = `${Math.round(data.temperature)}°C`;
    displayDesc.innerText = weatherCodes[data.weathercode] || "Cloudy";
    displayWind.innerText = `${data.windspeed} km/h`;
    displayHumidity.innerText = `${data.humidity}%`;

    weatherCard.classList.remove("hidden");
    errorMessage.classList.add("hidden");
}

function showError(): void {
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
        if (city) get_weather(city);
    }
});
