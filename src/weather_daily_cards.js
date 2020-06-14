import React from 'react';

import Row from 'react-bootstrap/Row';
import CardDeck from 'react-bootstrap/CardDeck';
import Card from 'react-bootstrap/Card';
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
            this.setState({
                weather_original: newWeatherData,
                weather: this.formatWeatherData(newWeatherData),
                isVisible: this.state.isVisible,
            });
        });
    };

    formatWeatherData(weatherData) {
        return weatherData.slice(0,numDaysToDisplay).map((dayData) => {
            dayData.weekday = Util.formatWeekday(dayData.observation_time.value);
            dayData.temp[0].min.value = Math.round(dayData.temp[0].min.value, 1);
            dayData.temp[1].max.value = Math.round(dayData.temp[1].max.value, 1);
            return dayData;
        });
    };

    toggleIsVisible() {
        this.titleButton.blur();

        this.setState({
            weather_original: this.state.weather_original,
            weather: this.state.weather,
            isVisible: !this.state.isVisible,
        });
    };

    render() {
        let weatherDailyCards;
        if (this.state.weather.length > 0) {
            weatherDailyCards = this.state.weather.slice().map((dayData, i) => {
                return <WeatherDailyCard key={'weather-daily-'+i} data={dayData}></WeatherDailyCard>;
            });
        }

        return (
            <>
                <Row>
                    <button className='text-left dash-cards-title' onClick={()=>this.toggleIsVisible()} ref={(element)=>this.titleButton=element}>
                        <h2 className='dash-horizontal-offset-10'>Daily Weather</h2>
                    </button>
                </Row>
                <Collapse in={this.state.isVisible}>
                    <Row>
                        <CardDeck>
                            {weatherDailyCards}
                            <Card className='dash-borderless'>
                                <button className='dash-refresh-button' onClick={()=>this.refreshWeather()} ref={(element)=>this.refreshButton=element}><i className='wi wi-refresh'/></button>
                            </Card>
                        </CardDeck>
                    </Row>
                </Collapse>
            </>
        );
    };
};

export default WeatherDailyCards;