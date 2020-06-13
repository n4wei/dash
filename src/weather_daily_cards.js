import React from 'react';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import CardDeck from 'react-bootstrap/CardDeck';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Collapse from 'react-bootstrap/Collapse';

import WeatherDailyCard from './weather_daily_card.js';
import Util from './util.js';
import Secrets from './config/secrets.json';

const numDaysToDisplay = 7;

class WeatherDailyCards extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            weather_original: [],
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
        const response = await fetch('https://api.climacell.co/v3/weather/forecast/daily?lat='+this.props.location.lat+'&lon='+this.props.location.lng+'&unit_system=us&start_time=now&fields=temp%2Cweather_code&apikey='+Secrets.climacell_token, {
            'method': 'GET',
        })
        .catch(err => console.error(err));
        return response.json();
    };

    refreshWeather() {
        if (Object.keys(this.props.location).length > 0) {
            this.getLatestWeatherData();
        }
    };

    getLatestWeatherData() {
        let weather_original = this.state.weather_original.slice();
        let shouldGetNewWeatherData = false;

        if (weather_original.length < numDaysToDisplay) {
            shouldGetNewWeatherData = true;
        } else {
            let currentDate = Util.formatDateISOLocal(new Date());
            let i = 0;
            while (i < weather_original.length && weather_original[i].observation_time.value <= currentDate) {
                i++
            }
            weather_original = weather_original.slice(i-1);
            console.log('sliced', weather_original);
            if (weather_original.length < numDaysToDisplay) {
                shouldGetNewWeatherData = true;
            }
        }

        if (shouldGetNewWeatherData) {
            this.getWeatherDataFromAPI().then((newWeatherData) => {
                console.log('new', newWeatherData);
                this.setState({
                    weather_original: newWeatherData,
                    weather: this.formatWeatherData(newWeatherData),
                    isVisible: this.state.isVisible,
                });
            });
        } else {
            this.setState({
                weather_original: weather_original,
                weather: this.formatWeatherData(weather_original),
                isVisible: this.state.isVisible,
            });
        }
    };

    formatWeatherData(weatherData) {
        return weatherData.slice(0,numDaysToDisplay).map((dailyData) => {
            dailyData.weekday = Util.formatWeekday(dailyData.observation_time.value);
            dailyData.temp[0].min.value = Math.round(dailyData.temp[0].min.value, 1);
            dailyData.temp[1].max.value = Math.round(dailyData.temp[1].max.value, 1);
            return dailyData;
        });
    };

    toggleIsVisible() {
        this.setState({
            weather_original: this.state.weather_original,
            weather: this.state.weather,
            isVisible: !this.state.isVisible,
        });
    };

    render() {
        let weatherDailyCards;
        if (this.state.weather.length > 0) {
            weatherDailyCards = this.state.weather.slice().map((dailyData, i) => {
                return <WeatherDailyCard key={'weather-daily-'+i} data={dailyData}></WeatherDailyCard>;
            });
        }

        return (
            <>
                <Row><Col><h2 className='dash-interactive' onClick={()=>this.toggleIsVisible()}>Daily Weather</h2></Col></Row>
                <Collapse in={this.state.isVisible}>
                    <Row>
                        <CardDeck>
                            {weatherDailyCards}
                            <Card className='dash-borderless'>
                                <Card.Body><Button variant='primary' onClick={()=>this.refreshWeather()}><i className='wi wi-refresh'/></Button></Card.Body>
                            </Card>
                        </CardDeck>
                    </Row>
                </Collapse>
            </>
        );
    };
};

export default WeatherDailyCards;