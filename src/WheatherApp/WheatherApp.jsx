import React, { useState, useEffect } from "react";
import WeatherForecast from "../WeatherForecast/WheatherForecast";
import "./WheatherApp.css";

const API_KEY = "d8fdde2b90b925ccfcfeb01ea0401eed";
const API_URL = "https://api.openweathermap.org/data/2.5/forecast";

const WeatherApp = () => {
    // stocker les données météorologiques
    const [weatherData, setWeatherData] = useState([]);
    // indique si les données sont en cours de chargement
    const [loading, setLoading] = useState(true);
    // Utilisation de la géolocalisation
    const [useGeolocation, setUseGeolocation] = useState(false);

    // Obtenir les données météo avec géoloc
    const getWeatherDataByLocation = async () => {
        try {
            // Vérif si loc prise en charge par le navigateur
            if (navigator.geolocation) {
                // position actuelle de l'utilisateur
                navigator.geolocation.getCurrentPosition(async (position) => {
                    // API avec les coordonnées de latitude et de longitude
                    const apiUrl = `${API_URL}?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${API_KEY}&units=metric`;
                    // Requête HTTP GET avec fetch
                    const response = await fetch(apiUrl);
                    // on attend JSON parse
                    const data = await response.json();
                    // Mise à jour données météorologiques
                    setWeatherData(data.list);
                    // chargement est terminé
                    setLoading(false);
                });
            } else {
                // Alerte si la géolocalisation n'est pas prise en charge
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

            // Mise à jour avec les données météorologiques
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

    // UseEffect pour charger les données initiales en fonction de la géolocalisation
    useEffect(() => {
        if (useGeolocation) {
            // Si la géolocalisation est activée
            getWeatherDataByLocation();
        } else {
            // Sinon, Données de la ville par défaut (Cannes)
            getWeatherData("Cannes");
        }
    }, [useGeolocation]);

    return (
        <div className="weather-app">
            <h1>Bulletin Météo</h1>
            {/* <h5 >(avec Cannes par defaut)</h5>*/}
            <div>
                {/* activer la géolocalisation */}
                <button onClick={() => setUseGeolocation(true)}>
                    Utiliser la Géolocalisation
                </button>
                <button onClick={() => setUseGeolocation(false)}>
                    Rechercher votre Ville
                </button>
            </div>
            {loading ? (
                <p>Chargement en cours...</p>
            ) : (
                <div className="weather-forecast">
                    {/* Affichez les prévisions météorologiques à partir des données récupérées */}
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
