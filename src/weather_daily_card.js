import React from 'react';
import Card from 'react-bootstrap/Card';
import WeatherIcon from './weather_icon.js';

function WeatherDailyCard(props) {
    const temperature = props.data.temp[0].min.value+'-'+props.data.temp[1].max.value+props.data.temp[1].max.units;

    return (
        <Card className='text-center dash-weather-daily-card'>
            <Card.Body>
                <Card.Title><WeatherIcon data={props.data} forceDaytime={true}/> {props.data.weekday}</Card.Title>
                <Card.Text><i className='wi wi-thermometer'></i> {temperature}</Card.Text>
            </Card.Body>
        </Card>
    );
};

export default WeatherDailyCard;