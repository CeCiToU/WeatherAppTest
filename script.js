const cityInput = document.querySelector(".search-box");
const searchBtn = document.querySelector(".search-btn");

window.addEventListener("load", async () => {
    await fetchWeather("Sofia");
});

searchBtn.addEventListener("click", async () => {
    const city = cityInput.value.trim();

    if (!city) {
        alert("Please enter a city.");
        return;
    }

    await fetchWeather(city);
});

cityInput.addEventListener("keydown", async (event) => {
    if (event.key === "Enter") {
        const city = cityInput.value.trim();

        if (!city) {
            alert("Please enter a city.");
            return;
        }

        await fetchWeather(city);
    }
});

async function fetchWeather(city) {
    try {
        const response = await fetch(`/getWeather?city=${encodeURIComponent(city)}`);
        const data = await response.json();

        if (!response.ok || data.error) {
            throw new Error(data.error || "City not found.");
        }

        displayWeather(data);
    } catch (error) {
        console.error("Error fetching weather:", error);
        alert(error.message || "City not found. Please try again.");
    }
}

function displayWeather(data) {
    const cityEl = document.querySelector(".city");
    const dateEl = document.querySelector(".date");
    const tempEl = document.querySelector(".temperature");
    const weatherIconEl = document.querySelector(".weather-icon");
    const conditionEl = document.querySelector(".condition");
    const feelsLikeEl = document.querySelector(".feels-like-value");
    const minTempEl = document.querySelector(".min-temp");
    const maxTempEl = document.querySelector(".max-temp");
    const humidityEl = document.querySelector(".humidity-value");
    const humidityFillEl = document.querySelector(".humidity-fill");
    const windSpeedEl = document.querySelector(".wind-speed");
    const sunriseEl = document.querySelector(".sunrise");
    const sunsetEl = document.querySelector(".sunset");
    const aqiEl = document.querySelector(".aqi-value");

    if (cityEl) cityEl.textContent = data.cityName ?? "Unknown city";

    if (dateEl) {
        const now = new Date();
        dateEl.textContent = now.toLocaleDateString("en-US", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        });
    }

    if (tempEl) tempEl.textContent = `${Math.round(data.temperature?.temp ?? 0)}°C`;

    if (weatherIconEl && data.icon) {
        weatherIconEl.src = `https://openweathermap.org/img/wn/${data.icon}@2x.png`;
        weatherIconEl.alt = data.conditions || "Weather icon";
    }

    if (conditionEl) {
        conditionEl.textContent = data.conditions || data.mainCondition || "No data";
    }

    if (feelsLikeEl) {
        feelsLikeEl.textContent = `${Math.round(data.temperature?.feels_like ?? 0)}°C`;
    }

    if (minTempEl) {
        minTempEl.textContent = `MIN: ${Math.round(data.temperature?.min ?? 0)}°C`;
    }

    if (maxTempEl) {
        maxTempEl.textContent = `MAX: ${Math.round(data.temperature?.max ?? 0)}°C`;
    }

    if (humidityEl) {
        humidityEl.textContent = `${data.humidity ?? 0}%`;
    }

    if (humidityFillEl) {
        humidityFillEl.style.width = `${data.humidity ?? 0}%`;
    }

    if (windSpeedEl) {
        windSpeedEl.textContent = `${data.windSpeed ?? 0} Km/h`;
    }

    if (sunriseEl && data.sunrise && data.timezone !== undefined) {
        sunriseEl.textContent = formatTime(data.sunrise, data.timezone);
    }

    if (sunsetEl && data.sunset && data.timezone !== undefined) {
        sunsetEl.textContent = formatTime(data.sunset, data.timezone);
    }

    if (aqiEl) {
        aqiEl.textContent = formatAqi(data.aqi);
    }
}

function formatTime(unixTime, timezoneOffset) {
    const localTime = new Date((unixTime + timezoneOffset) * 1000);
    const hours = String(localTime.getUTCHours()).padStart(2, "0");
    const minutes = String(localTime.getUTCMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
}

function formatAqi(aqi) {
    switch (aqi) {
        case 1:
            return "1 — Good";
        case 2:
            return "2 — Fair";
        case 3:
            return "3 — Moderate";
        case 4:
            return "4 — Poor";
        case 5:
            return "5 — Very Poor";
        default:
            return "No data";
    }
}