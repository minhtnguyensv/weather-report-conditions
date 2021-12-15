import { useState } from "react";
import { useForm } from "./hooks/useForm";
import auCities from "./AU_cities/cities-au.json"
import weatherFields from "./AU_cities/weather-fields.json"
import './index.css';
import axios from 'axios';

function WeatherApp() {
    // defining the initial state of weather data objects
    const [weatherData, setWeatherData]: any = useState<{
        Latitude: '',
        Longitude: '',
        Weather: '',
        CurrentTemperature: '',
        MinimumTemperature: '',
        MaximumTemperature: '',
        Humidity: '',
        WindSpeed: '',
        Visibility: '',
        Clouds: '',
        Base: '',
        Country: '',
        City: '',
        Sunrise: '',
        Sunset: ''
    }>();
    const [errorData, setErrorData] = useState('');
    const initialState = {
        searchCityName: "",
        selectCityName: ""
    };

    // getting the event handlers from our custom hook
    const { onChange, onSubmit, values } = useForm(
        fetchDataFromOpenWeatherApi,
        initialState
    );

    // this function will be called upon submitting the major city
    async function fetchDataFromOpenWeatherApi() {
        const cityName = values.searchCityName ? values.searchCityName : values.selectCityName || '';
        try {
            const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=8a7471ae97bc65787e2da614625090a2`);
            if (response && response.data) {
                const responseData = response.data
                const responseObj = {
                    Latitude: responseData.coord.lat,
                    Longitude: responseData.coord.lon,
                    Weather: responseData.weather[0] && responseData.weather[0].description || '',
                    CurrentTemperature: responseData.main.temp,
                    MinimumTemperature: responseData.main.temp_min,
                    MaximumTemperature: responseData.main.temp_max,
                    Humidity: responseData.main.humidity,
                    WindSpeed: responseData.wind.speed,
                    Visibility: responseData.visibility,
                    Clouds: responseData.clouds.all,
                    Base: responseData.base,
                    Country: responseData.sys.country,
                    City: responseData.name,
                    Sunrise: responseData.sys.sunrise,
                    Sunset: responseData.sys.sunset
                }
                setWeatherData(responseObj)
            }
        } catch (err) {
            setErrorData('Error in fetching weather data from Open API , visit https://api.openweathermap.org/')
        }
    }

    return (
        <div>
            <h2 style={{ backgroundColor: "lightblue" }}>Weather Reports for the cities in Australia !</h2>
            <form onSubmit={onSubmit}>
                <div>
                    <div onChange={onChange}>
                        Select the Major cities in Australia
                        <select className="mySelect" id="selectCityName" name="selectCityName">
                            <option>Select City</option>
                            {auCities["au-cities"].map(data => <option value={data.label}>{data.value}</option>)}
                        </select>
                    </div>
                    <div className="searchDiv">
                        (or) Search by any city name here
                        <input
                            name='searchCityName'
                            id='searchCityName'
                            placeholder='Search City Name'
                            onChange={onChange}
                        />
                        <button type='submit'>Submit</button></div>
                </div>
            </form>
            <div className="weatherTitle">
                Weather Data for the above selected major city
            </div>
            <div> {weatherData && !errorData ? <table>
                {weatherData && weatherFields && weatherFields['weatherFields'].map(({ label, field }) => {
                    return (<tr>
                        <td>{label}</td>
                        <td>{weatherData && weatherData.hasOwnProperty(field) ? weatherData[field] : ''}</td>
                    </tr>)
                })}
            </table> : errorData ? <p>{errorData}</p> : <p>Please select the city to show weather data</p>}</div>
        </div>
    );
}

export default WeatherApp;