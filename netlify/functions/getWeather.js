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

    const apiUrl =
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;

    const weatherResponse = await fetch(apiUrl);

    if (!weatherResponse.ok) {
      const errorText = await weatherResponse.text();
      return new Response(
        JSON.stringify({ error: "Weather API request failed", details: errorText }),
        {
          status: weatherResponse.status,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    const data = await weatherResponse.json();

    return new Response(JSON.stringify({
      city: data.name,
      temperature: data.main?.temp,
      humidity: data.main?.humidity,
      description: data.weather?.[0]?.description,
      windSpeed: data.wind?.speed
    }), {
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