import React from 'react';
import Card from 'react-bootstrap/Card';
import WeatherIcon from './weather_icon.js';

function WeatherHourlyCard(props) {
    return (
        <Card className='text-center dash-weather-hourly-card'>
            <Card.Header><h5><WeatherIcon data={props.data} forceDaytime={false}/> {props.data.hour}</h5></Card.Header>
            <Card.Body>
                <Card.Text><i className='wi wi-thermometer'></i> {props.data.temp.value+props.data.temp.units}</Card.Text>
                <Card.Text><i className='wi wi-hot'></i> {props.data.uv_index}</Card.Text>
                <Card.Text><i className='wi wi-cloud'></i> {props.data.cloud_cover.value+props.data.cloud_cover.units}</Card.Text>
                <Card.Text><i className='wi wi-umbrella'></i> {props.data.precipitation_probability.value+props.data.precipitation_probability.units}</Card.Text>
                <Card.Text><i className='wi wi-humidity'></i> {props.data.humidity.value+props.data.humidity.units}</Card.Text>
                <Card.Text><i className='wi wi-dust'></i> {props.data.epa_aqi.value+' ('+props.data.epa_primary_pollutant.value+')'}</Card.Text>
                <Card.Text><i className='wi wi-barometer'></i> {'g'+props.data.pollen_g+'/t'+props.data.pollen_t+'/w'+props.data.pollen_w}</Card.Text>
            </Card.Body>
        </Card>
    );
};

export default WeatherHourlyCard;