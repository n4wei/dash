import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import './css/weather-icons.min.css';
import './css/dash.css';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

import TimeDay from './time_day.js';
import WeatherHourlyCards from './weather_hourly_cards.js';
import WeatherDailyCards from './weather_daily_cards.js';
import StockQuoteCards from './stock_quote_cards.js';

class Dash extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            location: {},
        };

        this.getLocation();
    };

    getLocation() {
        navigator.geolocation.getCurrentPosition((data) => {
            this.setState({
                location: {
                    lat: data.coords.latitude,
                    lng: data.coords.longitude,
                },
            });
        }, (err) => {
            console.error(err);
        });
    };

    render() {
        const divider = <Row><h3>{'---'}</h3></Row>;

        return (
            <Container>
                <TimeDay/>
                {divider}
                <WeatherHourlyCards location={this.state.location}/>
                {divider}
                <WeatherDailyCards location={this.state.location}/>
                {divider}
                <StockQuoteCards/>
                {divider}
            </Container>
        );
    };
};

export default Dash;