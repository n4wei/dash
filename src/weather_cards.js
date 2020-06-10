import React from 'react';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import CardGroup from 'react-bootstrap/CardGroup';
import Button from 'react-bootstrap/Button';

import WeatherCard from './weather_card.js';
import Util from './util.js';
import Secrets from './config/secrets.json';

const numWeatherHoursToDisplay = 12;

class WeatherCards extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            location: {},
            weather_original: [],
            uv_original: [],
            weather: [],
        };

        this.refreshWeather();
    };

    async getWeatherDataFromAPI() {
        const response = await fetch('https://api.climacell.co/v3/weather/forecast/hourly?lat='+this.state.location.lat+'&lon='+this.state.location.lng+'&unit_system=us&start_time=now&fields=temp%2Chumidity%2Cprecipitation_type%2Cprecipitation_probability%2Csunrise%2Csunset%2Ccloud_cover%2Cweather_code%2Cepa_aqi%2Cepa_primary_pollutant%2Cepa_health_concern%2Cpollen_tree%2Cpollen_weed%2Cpollen_grass&apikey='+Secrets.climacell_token, {
            'method': 'GET',
        })
        .catch(err => console.error(err));
        return response.json();
    };

    async getUVDataFromAPI() {
        const response = await fetch('https://api.openuv.io/api/v1/forecast?lat='+this.state.location.lat+'&lng='+this.state.location.lng, {
            'method': 'GET',
            'headers': {
                'x-access-token': Secrets.openuv_token,
            }
        })
        .catch(err => console.error(err));
        return response.json();
    }

    formatWeatherData(weatherData) {
        return weatherData.slice(0,numWeatherHoursToDisplay).map((hourData) => {
            hourData.hour = Util.formatHour(hourData.observation_time.value);
            hourData.temp.value = Util.roundDecimals(hourData.temp.value, 1);
            hourData.uv_index = '-';
            hourData.cloud_cover.value = Math.round(hourData.cloud_cover.value);
            hourData.precipitation_probability.value = Math.round(hourData.precipitation_probability.value);
            hourData.humidity.value = Math.round(hourData.humidity.value);
            hourData.epa_aqi.value = Math.round(hourData.epa_aqi.value);
            hourData.pollen_g = hourData.pollen_grass.value === null ? '-' : hourData.pollen_grass.value;
            hourData.pollen_t = hourData.pollen_tree.value === null ? '-' : hourData.pollen_tree.value;
            hourData.pollen_w = hourData.pollen_weed.value === null ? '-' : hourData.pollen_weed.value;
            return hourData;
        });
    };

    mergeUVData(uvData, weatherData) {
        uvData.forEach((hourUVData) => {
            let formattedHour = Util.formatHour(hourUVData.uv_time);
            weatherData = weatherData.map((hourWeatherData) => {
                if (hourWeatherData.hour === formattedHour) {
                    hourWeatherData.uv_index = Util.roundDecimals(hourUVData.uv, 1);
                }
                return hourWeatherData;
            });
        });
        return weatherData;
    };

    getLatestUVData(weatherData_original, weatherData) {
        let uv_original = this.state.uv_original.slice();
        let shouldGetNewUVData = false;

        if (uv_original.length === 0) {
            shouldGetNewUVData = true;
        } else {
            let currentTime = new Date().toISOString();
            let i = 0;
            while (i < uv_original.length && new Date(uv_original[i].uv_time).toISOString() <= currentTime) {
                i++
            }
            if (i === uv_original.length) {
                shouldGetNewUVData = true;
            } else {
                uv_original = uv_original.slice(i-1);
                console.log('sliced', uv_original);
            }
        }

        if (shouldGetNewUVData) {
            this.getUVDataFromAPI().then((newUVData) => {
                newUVData = newUVData.result;
                console.log('new', newUVData);
                this.setState({
                    location: this.state.location,
                    weather_original: weatherData_original.slice(),
                    uv_original: newUVData.slice(),
                    weather: this.mergeUVData(newUVData, weatherData),
                });
            });
        } else {
            this.setState({
                location: this.state.location,
                weather_original: weatherData_original.slice(),
                uv_original: uv_original,
                weather: this.mergeUVData(uv_original, weatherData),
            });
        }
    };

    getLatestWeatherData() {
        let weather_original = this.state.weather_original.slice();
        let shouldGetNewWeatherData = false;

        if (weather_original.length === 0) {
            shouldGetNewWeatherData = true;
        } else {
            let currentTime = new Date().toISOString();
            let i = 0;
            while (i < weather_original.length && new Date(weather_original[i].observation_time.value).toISOString() <= currentTime) {
                i++
            }
            weather_original = weather_original.slice(i-1);
            console.log('sliced', weather_original);
            if (weather_original.length < numWeatherHoursToDisplay) {
                shouldGetNewWeatherData = true;
            }
        }

        if (shouldGetNewWeatherData) {
            this.getWeatherDataFromAPI().then((newWeatherData) => {
                console.log('new', newWeatherData);
                this.getLatestUVData(newWeatherData, this.formatWeatherData(newWeatherData));
            });
        } else {
            this.getLatestUVData(weather_original, this.formatWeatherData(weather_original));
        }
    };

    refreshWeather() {
        if (Object.keys(this.state.location).length === 0) {
            navigator.geolocation.getCurrentPosition((data) => {
                this.setState({
                    location: {
                        lat: data.coords.latitude,
                        lng: data.coords.longitude,
                    },
                    weather_original: this.state.weather_original,
                    uv_original: this.state.uv_original,
                    weather: this.state.weather,
                });
    
                this.getLatestWeatherData();
            }, (err) => {
                console.error(err);
            });
        } else {
            this.getLatestWeatherData();
        }
    };

    render() {
        let sunrise, sunset, weatherCards;
        if (this.state.weather.length > 0) {
            const weatherData = this.state.weather.slice();
            sunrise = Util.formatTime(weatherData[0].sunrise.value);
            sunset = Util.formatTime(weatherData[0].sunset.value);
            weatherCards = weatherData.map((weatherData, i) => {
                return <WeatherCard key={i} data={weatherData}></WeatherCard>;
            });
        }

        return (
            <>
                <Row>
                    <Col><h2>Weather - <i className='wi wi-sunrise'> {sunrise}</i>{' / '}<i className='wi wi-horizon'> {sunset}</i></h2></Col>
                    <Col><Button variant='primary' onClick={()=>this.refreshWeather()}><i className='wi wi-refresh'/></Button></Col>
                </Row>
                <Row><CardGroup>{weatherCards}</CardGroup></Row>
            </>
        );
    };
};

export default WeatherCards;