import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './css/weather-icons.min.css';

import Clock from './clock.js';
import WeatherCards from './weather_cards.js';
import StockQuoteCards from './stock_quote_cards.js';
import Util from './util.js';

class Dash extends React.Component {
    render() {
        return (
            <Container>
                <Row><Col><h1><Clock/></h1></Col></Row>
                <Row><Col><h2>{Util.formatDate(new Date())}</h2></Col></Row>
                <Row><h3>{'---'}</h3></Row>
                <WeatherCards/>
                <Row><h3>{'---'}</h3></Row>
                <StockQuoteCards/>
            </Container>
        );
    };
};

export default Dash;