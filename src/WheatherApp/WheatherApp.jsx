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
    // stocker la valeur de la ville
    const [city, setCity] = useState("");

    // Obtenir les données météo avec géoloc
    const getWeatherDataByLocation = async () => {
        try {
            // Vérif si loc prise en charge par le navigateur
            if (navigator.geolocation) {
                // position actuelle de l'utilisateur
                navigator.geolocation.getCurrentPosition(async (position) => {
                    // API avec les coordonnées de latitude et de longitude
                    const apiUrl = `${API_URL}?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${API_KEY}&units=metric`;
                    // GET avec fetch
                    const response = await fetch(apiUrl);
                    // on attend JSON parse
                    const data = await response.json();
                    // Mise à jour données météo
                    setWeatherData(data.list);
                    // chargement terminé
                    setLoading(false);
                });
            } else {
                // Alerte si loc n'est pas prise en charge
                alert(
                    "La géolocalisation n'est pas prise en charge par votre navigateur."
                );
            }
        } catch (error) {
            // erreurs lors de la récupération des données météo
            console.error(
                "Erreur lors de la récupération des données météo : ",
                error
            );
        }
    };

    // Fonction pour obtenir les données météorologiques en fonction de la ville
    const getWeatherData = async (city) => {
        try {
            // API avec le nom de la ville
            const apiUrl = `${API_URL}?q=${city}&appid=${API_KEY}&units=metric`;
            // Requête HTTP GET avec fetch
            const response = await fetch(apiUrl);
            // réponse en JSON parse et on attend qu'elle arrive
            const data = await response.json();

            // Mise à jour avec données météo
            setWeatherData(data.list);
            // chargement terminé
            setLoading(false);
        } catch (error) {
            console.error(
                "Erreur lors de la récupération des données météo : ",
                error
            );
        }
    };

    // UseEffect pour charger les données initiales en fonction géoloc
    useEffect(() => {
        if (useGeolocation) {
            // géoloc activée
            getWeatherDataByLocation();
        } else {
            // Données de la ville par défaut (Cannes)
            getWeatherData("Cannes");
        }
    }, [useGeolocation]);

    // bouton "Rechercher"
    const handleSearch = () => {
        // il faut que la ville ne soit pas vide
        if (city.trim() !== "") {
            getWeatherData(city);
        }
    };

    return (
        <div className="weather-app">
            <h1>Bulletin Météo</h1>
            <div>
                {/* activer la géolocalisation */}
                <button onClick={() => setUseGeolocation(true)}>
                    Utiliser la Géolocalisation
                </button>
                <button onClick={handleSearch}>Rechercher</button>
            </div>
            {loading ? (
                <p>Chargement en cours...</p>
            ) : (
                <div className="weather-forecast">
                    {/* Prévisions météorologiques à partir des données récupérées */}
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
