import React from 'react';
import Card from 'react-bootstrap/Card';
import './css/weather-icons.min.css';

function WeatherCardHeader(props) {
    let icon;
    let convertToTime = (timeStr) => new Date(timeStr).toLocaleTimeString('en-US', {hour12:false});
    let currentTime = convertToTime(props.data.observation_time.value);
    let sunriseTime = convertToTime(props.data.sunrise.value);
    let sunsetTime = convertToTime(props.data.sunset.value);
    let dayTime = currentTime >= sunriseTime && currentTime < sunsetTime ? true : false;

    switch(props.data.weather_code.value) {
        case 'clear':
            icon = dayTime? <i className='wi wi-day-sunny'></i> : <i className='wi wi-night-clear'></i>;
            break;
        case 'mostly_clear':
            icon = dayTime? <i className='wi wi-day-sunny-overcast'></i> : <i className='wi wi-night-alt-partly-cloudy'></i>;
            break;
        case 'partly_cloudy':
            icon = dayTime? <i className='wi wi-day-cloudy'></i> : <i className='wi wi-night-alt-cloudy'></i>;
            break;
        case 'cloudy':
            icon = <i className='wi wi-cloud'></i>;
            break;
        case 'mostly_cloudy':
            icon = <i className='wi wi-cloudy'></i>;
            break;
        case 'fog_light':
            icon = <i className='wi wi-fog'></i>;
            break;
        case 'fog':
            icon = <i className='wi wi-fog'></i>;
            break;
        case 'drizzle':
            icon = <i className='wi wi-sprinkle'></i>;
            break;
        case 'rain_light':
            icon = <i className='wi wi-sprinkle'></i>;
            break;
        case 'rain':
            icon = <i className='wi wi-showers'></i>;
            break;
        case 'rain_heavy':
            icon = <i className='wi wi-rain'></i>;
            break;
        case 'tstorm':
            icon = <i className='wi wi-thunderstorm'></i>;
            break;
        case 'freezing_drizzle':
            icon = <><i className='wi wi-snowflake-cold'></i><i className='wi wi-sprinkle'></i></>;
            break;
        case 'freezing_rain_light':
            icon = <><i className='wi wi-snowflake-cold'></i><i className='wi wi-sprinkle'></i></>;
            break;
        case 'freezing_rain':
            icon = <><i className='wi wi-snowflake-cold'></i><i className='wi wi-showers'></i></>;
            break;
        case 'freezing_rain_heavy':
            icon = <><i className='wi wi-snowflake-cold'></i><i className='wi wi-rain'></i></>;
            break;
        case 'ice_pellets_light':
            icon = <><i className='wi wi-snowflake-cold'></i><i className='wi wi-sleet'></i></>;
            break;
        case 'ice_pellets':
            icon = <><i className='wi wi-snowflake-cold'></i><i className='wi wi-rain-mix'></i></>;
            break;
        case 'ice_pellets_heavy':
            icon = <><i className='wi wi-snowflake-cold'></i><i className='wi wi-hail'></i></>;
            break;
        case 'flurries':
            icon = <i className='wi wi-snowflake-cold'></i>;
            break;
        case 'snow_light':
            icon = <i className='wi wi-snowflake-cold'></i>;
            break;
        case 'snow':
            icon = <i className='wi wi-snow'></i>;
            break;
        case 'snow_heavy':
            icon = <><i className='wi wi-strong-wind'></i><i className='wi wi-snow'></i></>;
            break;
        default:
            icon = <i className='wi wi-train'></i>;
    };

    return <Card.Header><h5>{icon} {props.data.hour}</h5></Card.Header>;
};

function WeatherCard(props) {
    return (
        <Card className='text-center' style={{ width: '10rem' }}>
            <WeatherCardHeader data={props.data}></WeatherCardHeader>
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

export default WeatherCard;