import React, { useState, useEffect } from "react";
import WeatherForecast from "../WeatherForecast/WheatherForecast.jsx";
import "./WheatherApp.css";

const API_KEY = "d8fdde2b90b925ccfcfeb01ea0401eed";
const API_URL = "https://api.openweathermap.org/data/2.5/forecast";

const WeatherApp = () => {
    const [weatherData, setWeatherData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [useGeolocation, setUseGeolocation] = useState(false);
    const [city, setCity] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [originalWeatherData, setOriginalWeatherData] = useState([]);

    const getWeatherDataByLocation = async () => {
        try {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(async (position) => {
                    const apiUrl = `${API_URL}?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${API_KEY}&units=metric`;
                    const response = await fetch(apiUrl);
                    const data = await response.json();
                    setOriginalWeatherData(data.list);
                    setWeatherData(data.list);
                    setLoading(false);
                });
            } else {
                alert(
                    "La géolocalisation n'est pas prise en charge par votre navigateur."
                );
            }
        } catch (error) {
            console.error(
                "Erreur lors de la récupération des données météo : ",
                error
            );
        }
    };

    const getWeatherData = async (city) => {
        try {
            const apiUrl = `${API_URL}?q=${city}&appid=${API_KEY}&units=metric`;
            const response = await fetch(apiUrl);
            const data = await response.json();
            setOriginalWeatherData(data.list);
            setWeatherData(data.list);
            setLoading(false);
        } catch (error) {
            console.error(
                "Erreur lors de la récupération des données météo : ",
                error
            );
        }
    };

    const filterWeatherDataByDate = (date) => {
        if (date) {
            const filteredData = originalWeatherData.filter((forecast) => {
                const forecastDate = new Date(forecast.dt_txt).toDateString();
                return forecastDate === date.toDateString();
            });
            setWeatherData(filteredData);
        } else {
            // Si aucune date n'est sélectionnée, rétablissez les données originales
            setWeatherData(originalWeatherData);
        }
    };

    useEffect(() => {
        if (useGeolocation) {
            getWeatherDataByLocation();
        } else {
            getWeatherData("Cannes");
        }
    }, [useGeolocation]);

    useEffect(() => {
        filterWeatherDataByDate(selectedDate);
    }, [selectedDate]);

    const handleSearch = () => {
        if (city.trim() !== "") {
            getWeatherData(city);
        }
    };

    return (
        <div className="weather-app">
            <h1>Bulletin Météo</h1>
            <div className="envieTest">
                <button onClick={() => setUseGeolocation(true)}>
                    Géolocalisation
                </button>
                <input
                    type="date"
                    placeholder="Date sélectionnée"
                    value={
                        selectedDate
                            ? selectedDate.toISOString().slice(0, 10)
                            : ""
                    }
                    onChange={(e) => setSelectedDate(new Date(e.target.value))}
                />
                <div>
                    <input
                        type="text"
                        placeholder="Entrez votre ville"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                    />
                    <button onClick={handleSearch}>Rechercher</button>
                </div>
            </div>
            {loading ? (
                <p>Chargement en cours...</p>
            ) : (
                <div className="weather-forecast">
                    {weatherData.map((forecast) => (
                        <WeatherForecast
                            key={forecast.dt}
                            forecast={forecast}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default WeatherApp;
