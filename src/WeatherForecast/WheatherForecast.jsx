import React from "react";
import "./WeatherForecast.css";

const WeatherForecast = ({ forecast }) => {
    const date = new Date(forecast.dt * 1000);
    const temperatureMin = forecast.main.temp_min;
    const temperatureMax = forecast.main.temp_max;
    const windSpeed = forecast.wind.speed;
    const description = forecast.weather[0].description;
    const icon = `https://openweathermap.org/img/w/${forecast.weather[0].icon}.png`;

    return (
        <div className="weather-forecast-item">
            <h3>{date.toLocaleDateString()}</h3>
            <img src={icon} alt={description} />
            <p>{description}</p>
            <p>Minimales: {temperatureMin}°C</p>
            <p>Maximales: {temperatureMax}°C</p>
            <p>Vitesse du vent: {windSpeed}m/s</p>
        </div>
    );
};

export default WeatherForecast;
