import React from 'react';

import Row from 'react-bootstrap/Row';
import CardGroup from 'react-bootstrap/CardGroup';
import Card from 'react-bootstrap/Card';
import Collapse from 'react-bootstrap/Collapse';

import WeatherHourlyCard from './weather_hourly_card.js';
import Util from './util.js';
import Secrets from './config/secrets.json';

const numHoursToDisplay = 11;

class WeatherHourlyCards extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            weather_original: [],
            uv_original: [],
            weather: [],
            isVisible: true,
        };
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

    refreshWeather() {
        if (this.refreshButton !== undefined) {
            this.refreshButton.blur();
        }

        if (Object.keys(this.props.location).length > 0) {
            this.getLatestWeatherData();
        }
    };

    getLatestWeatherData() {
        this.getWeatherDataFromAPI().then((newWeatherData) => {
            console.log('new', newWeatherData);

            this.getUVDataFromAPI().then((newUVData) => {
                newUVData = newUVData.result;
                console.log('new', newUVData);

                this.setState({
                    weather_original: newWeatherData,
                    uv_original: newUVData,
                    weather: this.mergeUVData(newUVData, this.formatWeatherData(newWeatherData)),
                    isVisible: this.state.isVisible,
                });
            });
        });
    };

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

    toggleIsVisible() {
        this.titleButton.blur();

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
            weatherHourlyCards = weatherData.map((hourData, i) => {
                return <WeatherHourlyCard key={'weather-hourly-'+i} data={hourData}></WeatherHourlyCard>;
            });
        }

        return (
            <>
                <Row>
                    <button className='text-left dash-cards-title' onClick={()=>this.toggleIsVisible()} ref={(element)=>this.titleButton=element}>
                        <h2>
                            Hourly Weather
                            <span className='dash-sun-icon dash-horizontal-offset'>
                                <i className='wi wi-sunrise'> {sunrise}</i>{' / '}<i className='wi wi-horizon'> {sunset}</i>
                            </span>
                        </h2>
                    </button>
                </Row>
                <Collapse in={this.state.isVisible}>
                    <Row>
                        <CardGroup>
                            {weatherHourlyCards}
                            <Card className='dash-borderless'>
                                <button className='dash-refresh-button dash-horizontal-offset' onClick={()=>this.refreshWeather()} ref={(element)=>this.refreshButton=element}><i className='wi wi-refresh'/></button>
                            </Card>
                        </CardGroup>
                    </Row>
                </Collapse>
            </>
        );
    };
};

export default WeatherHourlyCards;