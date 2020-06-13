import React from 'react';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import CardGroup from 'react-bootstrap/CardGroup';
import Button from 'react-bootstrap/Button';
import Collapse from 'react-bootstrap/Collapse';

import WeatherHourlyCard from './weather_hourly_card.js';
import Util from './util.js';
import Secrets from './config/secrets.json';

const numHoursToDisplay = 12;

class WeatherHourlyCards extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            weather_original: [],
            uv_original: [],
            weather: [],
            isVisible: true,
        };

        this.refreshWeather();
    };

    componentDidUpdate(prevProps) {
        if (this.props.location.lat !== prevProps.location.lat || this.props.location.lng !== prevProps.location.lng) {
            this.refreshWeather();
        }
    };

    async getWeatherDataFromAPI() {
        const response = await fetch('https://api.climacell.co/v3/weather/forecast/hourly?lat='+this.props.location.lat+'&lon='+this.props.location.lng+'&unit_system=us&start_time=now&fields=temp%2Chumidity%2Cprecipitation_type%2Cprecipitation_probability%2Csunrise%2Csunset%2Ccloud_cover%2Cweather_code%2Cepa_aqi%2Cepa_primary_pollutant%2Cepa_health_concern%2Cpollen_tree%2Cpollen_weed%2Cpollen_grass&apikey='+Secrets.climacell_token, {
            'method': 'GET',
        })
        .catch(err => console.error(err));
        return response.json();
    };

    async getUVDataFromAPI() {
        const response = await fetch('https://api.openuv.io/api/v1/forecast?lat='+this.props.location.lat+'&lng='+this.props.location.lng, {
            'method': 'GET',
            'headers': {
                'x-access-token': Secrets.openuv_token,
            }
        })
        .catch(err => console.error(err));
        return response.json();
    }

    formatWeatherData(weatherData) {
        return weatherData.slice(0,numHoursToDisplay).map((hourData) => {
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
                    weather_original: weatherData_original,
                    uv_original: newUVData,
                    weather: this.mergeUVData(newUVData, weatherData),
                    isVisible: this.state.isVisible,
                });
            });
        } else {
            this.setState({
                weather_original: weatherData_original,
                uv_original: uv_original,
                weather: this.mergeUVData(uv_original, weatherData),
                isVisible: this.state.isVisible,
            });
        }
    };

    getLatestWeatherData() {
        let weather_original = this.state.weather_original.slice();
        let shouldGetNewWeatherData = false;

        if (weather_original.length < numHoursToDisplay) {
            shouldGetNewWeatherData = true;
        } else {
            let currentTime = new Date().toISOString();
            let i = 0;
            while (i < weather_original.length && new Date(weather_original[i].observation_time.value).toISOString() <= currentTime) {
                i++
            }
            weather_original = weather_original.slice(i-1);
            console.log('sliced', weather_original);
            if (weather_original.length < numHoursToDisplay) {
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
        if (Object.keys(this.props.location).length > 0) {
            this.getLatestWeatherData();
        }
    };

    toggleIsVisible() {
        this.setState({
            weather_original: this.state.weather_original,
            uv_original: this.state.uv_original,
            weather: this.state.weather,
            isVisible: !this.state.isVisible,
        });
    };

    render() {
        let sunrise, sunset, weatherHourlyCards;
        if (this.state.weather.length > 0) {
            const weatherData = this.state.weather.slice();
            sunrise = Util.formatTime(weatherData[0].sunrise.value);
            sunset = Util.formatTime(weatherData[0].sunset.value);
            weatherHourlyCards = weatherData.map((weatherData, i) => {
                return <WeatherHourlyCard key={'weather-hourly-'+i} data={weatherData}></WeatherHourlyCard>;
            });
        }

        return (
            <>
                <Row>
                    <Col><h2 className='dash-interactive' onClick={()=>this.toggleIsVisible()}>Weather - <i className='wi wi-sunrise'> {sunrise}</i>{' / '}<i className='wi wi-horizon'> {sunset}</i></h2></Col>
                    <Col><Button variant='primary' onClick={()=>this.refreshWeather()}><i className='wi wi-refresh'/></Button></Col>
                </Row>
                <Collapse in={this.state.isVisible}>
                    <Row><CardGroup>{weatherHourlyCards}</CardGroup></Row>
                </Collapse>
            </>
        );
    };
};

export default WeatherHourlyCards;