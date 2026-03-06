const cityInput = document.querySelector("#search-input");
const searchBtn = document.querySelector("#search-btn");

window.addEventListener("load", async () => {
    try {
        const response = await fetch(`/getWeather?city=${encodeURIComponent(city)}`)
        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        console.error("Error fetching weather:", error);
        alert("City not found. Please try again.");
    }
});

cityInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") searchBtn.click();
});

searchBtn.addEventListener("click", async () => {
    const city = cityInput.value.trim();
    if (!city) return alert("Please enter a city name.");
    try {
        const response = await fetch(`/getWeather?city=${city}`);
        if (!response.ok) {
            throw new Error("City not found.");
        }
        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        console.error("Error fetching weather:", error);
        alert("City not found. Please try again.");
    }
});


function displayWeather(data) {
    updateWeatherTheme(data);
    document.querySelector("#city-name").textContent = data.cityName;
    updateCurrentDate(data);
    document.querySelector("#main-icon").src = `https://openweathermap.org/img/wn/${data.icon}@4x.png`;
    document.querySelector("#main-temp").textContent = `${Math.round(data.temperature.temp)}°C`;
    document.querySelector("#conditions").textContent = data.conditions;

    document.querySelector("#feels-like").textContent = `${Math.round(data.temperature.feels_like)}°C`;
    document.querySelector("#min-temp").textContent = `MIN: ${Math.round(data.temperature.min)}°C`;
    document.querySelector("#max-temp").textContent = `MAX: ${Math.round(data.temperature.max)}°C`;

    document.querySelector("#humidity-val").textContent = `${data.humidity}%`;
    document.querySelector(".progress-fill").style.width = `${data.humidity}%`;

    const windSpeed = data.windSpeed || 0;
    document.querySelector("#wind-speed").textContent = `${windSpeed} m/s`;
    updateWind(windSpeed);

    sunrise_sunset(data);

    aqi(data);
}

function updateCurrentDate(data) {
    const dateElement = document.querySelector("#full-date");

    const now = new Date();
    const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);

    const cityTime = new Date(utcTime + (data.timezone * 1000));

    const options = {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };

    dateElement.textContent = cityTime.toLocaleDateString('en-GB', options);
}

function aqi(data){
    if (data.aqi) {
        const aqiDot = document.querySelector(".aqi-dot");
        const aqiText = document.querySelector("#aqi-status-text");

        const statusMap = {
            1: "Good",
            2: "Fair",
            3: "Moderate",
            4: "Poor",
            5: "Very Poor"
        };

        const position = ((data.aqi - 1) / 4) * 100;
        aqiDot.style.left = `${position}%`;
        aqiText.textContent = `${data.aqi} — ${statusMap[data.aqi]}`;
    }
}

function sunrise_sunset(data){
    if (data.sunrise && data.sunset) {
        const sunCircle = document.querySelector("#sun-position");
        const sunProgress = calculateSunProgress(data.sunrise, data.sunset);

        if (sunProgress <= 0 || sunProgress >= 100) {
            sunCircle.style.display = "none";
        } else {
            sunCircle.style.display = "block";

            const angle = (sunProgress / 100) * Math.PI;
            const radius = 40;
            const centerX = 50;
            const centerY = 45;
            const posX = centerX - radius * Math.cos(angle);
            const posY = centerY - radius * Math.sin(angle);

            sunCircle.setAttribute("cx", posX);
            sunCircle.setAttribute("cy", posY);
        }

        const sunTimes = document.querySelectorAll(".sun-times span");
        sunTimes[0].textContent = formatUnixTime(data.sunrise, data.timezone);
        sunTimes[1].textContent = formatUnixTime(data.sunset, data.timezone);
    }
}

function formatUnixTime(unixTimestamp, timezone) {
    const date = new Date((unixTimestamp + timezone) * 1000);

    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');

    return `${hours}:${minutes}`;
}

function updateWind(speed) {
    const dots = document.querySelectorAll(".dot");
    dots.forEach((dot, index) => {
        dot.classList.toggle("active", index < Math.ceil(speed / 5));
    });

    if (speed < 1) document.querySelector("#wind-desc").textContent = "Calm";
    else if (speed < 5) document.querySelector("#wind-desc").textContent = "Light Breeze";
    else if (speed < 11) document.querySelector("#wind-desc").textContent = "Gentle Breeze";
    else if (speed < 19) document.querySelector("#wind-desc").textContent = "Moderate Breeze";
    else if (speed < 28) document.querySelector("#wind-desc").textContent = "Fresh Breeze";
    else if (speed < 38) document.querySelector("#wind-desc").textContent = "Strong Breeze";
    else document.querySelector("#wind-desc").textContent = "Gale";

}

function calculateSunProgress(sunrise, sunset) {
    const now = Math.floor(Date.now() / 1000);
    if (now < sunrise) return 0;
    if (now > sunset) return 100;
    return ((now - sunrise) / (sunset - sunrise)) * 100;
}

function updateWeatherTheme(data) {
    const leftSide = document.querySelector('.left-side');
    const condition = data.mainCondition;
    const isNight = data.icon.includes('n');

    const images = {
        'Clear': isNight
            ? 'https://i.pinimg.com/1200x/35/a6/77/35a6772eaea3d3dbfd9ae36c9f9995e0.jpg'
            : 'https://i.pinimg.com/736x/1a/65/74/1a6574a4d3ecfc0f84cd926a78b394f1.jpg',
        'Clouds': isNight
            ? 'https://i.pinimg.com/736x/41/0a/19/410a199b8f89335e0c7e953c1206d20d.jpg'
            :'https://i.pinimg.com/736x/29/56/1f/29561f18ebdc21911ac87a8f8576870d.jpg',
        'Rain': isNight
            ? 'https://i.pinimg.com/736x/cf/42/e0/cf42e040ea4595e20213fca31be1abf6.jpg'
            :'https://i.pinimg.com/736x/17/62/db/1762db3a0da977a4d23fcbc84a912b2b.jpg',
        'Snow': 'https://i.pinimg.com/736x/ab/c5/ef/abc5efbd22b98378309b8f06ba5d13a4.jpg',
        'Thunderstorm': 'https://i.pinimg.com/1200x/ea/f4/a5/eaf4a5a41b25f6a0c6ce0c808fdec195.jpg',
        'Mist': 'https://i.pinimg.com/1200x/bb/b3/44/bbb344aa0b99c66c25e6138afb844116.jpg'
    };

    const bgUrl = images[condition] || images['Clouds'];

    leftSide.style.backgroundImage = `linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.7)), url('${bgUrl}')`;
    leftSide.style.backgroundSize = 'cover';
    leftSide.style.backgroundPosition = 'center';
}
