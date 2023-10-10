import React, { useState, useEffect } from "react";
import WeatherForecast from "../WeatherForecast/WheatherForecast.jsx";
import "./WheatherApp.css";

const API_KEY = "d8fdde2b90b925ccfcfeb01ea0401eed";
const API_URL = "https://api.openweathermap.org/data/2.5/forecast";

const WeatherApp = () => {
    // stocker les données météorologiques
    const [weatherData, setWeatherData] = useState([]);
    // indique si les données sont en cours de chargement
    const [loading, setLoading] = useState(true);
    // Utilisation géolocalisation
    const [useGeolocation, setUseGeolocation] = useState(false);
    // stocker valeur de la ville
    const [city, setCity] = useState("");
    // stocker date sélectionnée dans le calendrier
    const [selectedDate, setSelectedDate] = useState("");

    // Obtenir les données météo avec géoloc
    const getWeatherDataByLocation = async () => {
        try {
            // ...
        } catch (error) {
            console.error(
                "Erreur lors de la récupération des données météo : ",
                error
            );
        }
    };

    // Fonction pour obtenir les données météos en fonction de la ville
    const getWeatherData = async (city) => {
        try {
            // Construire l'URL de l'API en utilisant la clé API et le nom de la ville
            const apiUrl = `${API_URL}?q=${city}&appid=${API_KEY}&units=metric`;

            // Faire une requête GET avec fetch
            const response = await fetch(apiUrl);

            // Attendre la réponse et la convertir en JSON
            const data = await response.json();

            // Mise à jour des données météo
            setWeatherData(data.list);

            // Marquer le chargement comme terminé
            setLoading(false);
        } catch (error) {
            // Gérer les erreurs en affichant un message d'erreur
            console.error(
                "Erreur lors de la récupération des données météo : ",
                error
            );
        }
    };

    // Fonction pour filtrer les données météo en fonction de la date
    const filterWeatherDataByDate = (date) => {
        const filteredData = weatherData.filter((forecast) => {
            const forecastDate = new Date(forecast.dt_txt).toDateString();
            return forecastDate === date.toDateString();
        });

        return filteredData;
    };

    useEffect(() => {
        if (useGeolocation) {
            getWeatherDataByLocation();
        } else {
            getWeatherData("Cannes");
        }
    }, [useGeolocation]);

    useEffect(() => {
        if (selectedDate) {
            const filteredData = filterWeatherDataByDate(selectedDate);
            setWeatherData(filteredData);
        }
    }, [selectedDate]);

    const handleSearch = () => {
        if (city.trim() !== "") {
            getWeatherData(city);
        }
    };

    return (
        <div className="weather-app">
            <h1>Bulletin Météo</h1>
            <div>
                <button onClick={() => setUseGeolocation(true)}>
                    Utiliser la Géolocalisation
                </button>
                <div>
                    <input
                        placeholder="Entrez votre ville"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                    />
                    <input
                        type="date"
                        placeholder="Date sélectionnée"
                        value={
                            selectedDate
                                ? selectedDate.toISOString().slice(0, 10)
                                : ""
                        }
                        onChange={(e) =>
                            setSelectedDate(new Date(e.target.value))
                        }
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
