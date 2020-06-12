import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import './css/weather-icons.min.css';
import './css/dash.css';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

import TimeDate from './time_date.js';
import WeatherCards from './weather_cards.js';
import StockQuoteCards from './stock_quote_cards.js';

function Dash() {
    return (
        <Container>
            <TimeDate/>
            <Row><h3>{'---'}</h3></Row>
            <WeatherCards/>
            <Row><h3>{'---'}</h3></Row>
            <StockQuoteCards/>
            <Row><h3>{'---'}</h3></Row>
        </Container>
    );
};

export default Dash;