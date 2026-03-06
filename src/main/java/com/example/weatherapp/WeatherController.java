package com.example.weatherapp;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;


@RestController
public class WeatherController {
    private static final String BASE_URL = "https://api.openweathermap.org/data/2.5/weather?q=";
    private static final String API_KEY = "f497096c7eec037b02b14c514622b2f7";

    @GetMapping("/getWeather")
    public Weather getWeather(@RequestParam String city) {
        String encodedCity = URLEncoder.encode(city, StandardCharsets.UTF_8);
        String urlString = BASE_URL + encodedCity + "&APPID=" + API_KEY + "&units=metric";

        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(urlString))
                    .GET()
                    .build();
            try {
                HttpClient client = HttpClient.newHttpClient();
                HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

                if (response.statusCode() == 200) {
                    ObjectMapper mapper = new ObjectMapper();
                    JsonNode node = mapper.readTree(response.body());

                    String name = node.get("name").asString();
                    int temp = node.get("main").path("temp").asInt();
                    int feels_like = node.get("main").path("feels_like").asInt();
                    int min = node.get("main").path("temp_min").asInt();
                    int max = node.get("main").path("temp_max").asInt();
                    Temperature temperature = new Temperature(temp, feels_like, min, max);
                    String cond = node.get("weather").get(0).path("description").asString();
                    String icon = node.get("weather").get(0).path("icon").asString();
                    int hum = node.get("main").path("humidity").asInt();
                    int wind = node.get("wind").path("speed").asInt();
                    int timezone = node.get("timezone").asInt();
                    int sunrise = node.get("sys").path("sunrise").asInt();
                    int sunset = node.get("sys").path("sunset").asInt();
                    String mainCondition = node.get("weather").get(0).path("main").asString();

                    double lat = node.get("coord").get("lat").asDouble();
                    double lon = node.get("coord").get("lon").asDouble();

                    String aqiUrl = "https://api.openweathermap.org/data/2.5/air_pollution?lat=" + lat + "&lon=" + lon + "&APPID=" + API_KEY;

                    HttpRequest aqiRequest = HttpRequest.newBuilder().uri(URI.create(aqiUrl)).GET().build();
                    HttpResponse<String> aqiResponse = client.send(aqiRequest, HttpResponse.BodyHandlers.ofString());

                    int aqiValue = 0;
                    if (aqiResponse.statusCode() == 200) {
                        JsonNode aqiNode = mapper.readTree(aqiResponse.body());
                        aqiValue = aqiNode.get("list").get(0).get("main").get("aqi").asInt();
                    }

                    return new Weather(name, temperature, cond, hum, icon, wind, timezone, sunrise, sunset, mainCondition,aqiValue);
                } else {
                    System.out.println("Error: Could not find city. (Status Code: " + response.statusCode() + ")");
                    return null;
                }
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}