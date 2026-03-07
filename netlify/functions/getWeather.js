export default async (request) => {
  try {
    const url = new URL(request.url);
    const city = url.searchParams.get("city");

    if (!city) {
      return new Response(JSON.stringify({ error: "City is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const apiKey = process.env.OPENWEATHER_API_KEY;

    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Missing API key" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    const weatherUrl =
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;

    const weatherResponse = await fetch(weatherUrl);
    const weatherData = await weatherResponse.json();

    if (!weatherResponse.ok) {
      return new Response(
        JSON.stringify({ error: weatherData.message || "City not found." }),
        {
          status: weatherResponse.status,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    let aqi = null;
    const lat = weatherData.coord?.lat;
    const lon = weatherData.coord?.lon;

    if (lat != null && lon != null) {
      const airUrl =
        `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;

      const airResponse = await fetch(airUrl);
      const airData = await airResponse.json();

      if (airResponse.ok && airData.list && airData.list[0] && airData.list[0].main) {
        aqi = airData.list[0].main.aqi;
      }
    }

    const result = {
      cityName: weatherData.name,
      icon: weatherData.weather?.[0]?.icon,
      conditions: weatherData.weather?.[0]?.description,
      mainCondition: weatherData.weather?.[0]?.main,
      temperature: {
        temp: weatherData.main?.temp,
        feels_like: weatherData.main?.feels_like,
        min: weatherData.main?.temp_min,
        max: weatherData.main?.temp_max
      },
      humidity: weatherData.main?.humidity,
      windSpeed: weatherData.wind?.speed,
      timezone: weatherData.timezone,
      sunrise: weatherData.sys?.sunrise,
      sunset: weatherData.sys?.sunset,
      aqi: aqi
    };

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Server error", details: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
};