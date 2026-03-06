package com.example.weatherapp;

public class Weather {
    private String cityName;
    private Temperature temperature;
    private String conditions;
    private int humidity;
    private String icon;
    private int windSpeed;
    private int timezone;
    private int sunrise;
    private int sunset;
    private String mainCondition;
    private int aqi;

    public Weather(String cityName, Temperature temperature, String conditions, int humidity, String icon, int windSpeed, int timezone, int sunrise, int sunset, String mainCondition, int aqi) {
        this.cityName = cityName;
        this.temperature = temperature;
        this.conditions = conditions;
        this.humidity = humidity;
        this.icon = icon;
        this.windSpeed = windSpeed;
        this.timezone = timezone;
        this.sunrise = sunrise;
        this.sunset = sunset;
        this.mainCondition = mainCondition;
        this.aqi = aqi;
    }

    public String getCityName() {return cityName;}

    public Temperature getTemperature() {return temperature;}

    public String getConditions() {return conditions;}

    public int getHumidity() {return humidity;}

    public String getIcon() {return icon;}

    public int getWindSpeed() { return windSpeed; }

    public int getTimezone() { return timezone; }

    public int getSunrise() { return sunrise; }

    public int getSunset() { return sunset; }

    public String getMainCondition() { return mainCondition; }

    public int getAqi() { return aqi;}

}
